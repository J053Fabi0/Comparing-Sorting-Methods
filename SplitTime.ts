const UNITS = {
  year: 31536000000,
  month: 2592000000,
  week: 604800000,
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  second: 1000,
  millisecond: 1,
} as const;

type Units = keyof typeof UNITS;
type Variant = "extended" | "symbols";
const simplePlural =
  (plural = "s") =>
  (time: number, base: string) =>
    `${time} ${base}${time !== 1 ? plural : ""}`;

type Translator = (time: number) => string;
const createSimplePlural = (
  plural: string,
  extendedUnitNames: [string, string, string, string, string, string, string, string],
  symbolUnitNames: Partial<Record<Units, string>> = {
    hour: "h",
    minute: "m",
    second: "s",
    millisecond: "ms",
  }
) =>
  (Object.keys(UNITS) as Array<Units>).reduce(
    (obj, unit, i) =>
      Object.assign(obj, {
        [unit]: {
          extended: (time: number) => simplePlural(plural)(time, extendedUnitNames[i]),
          get symbols() {
            return symbolUnitNames[unit] ? (time: number) => `${time}${symbolUnitNames[unit]}` : this.extended;
          },
          set symbols(fn: Translator) {
            this.extended = fn;
          },
        },
      }),
    {}
  ) as Record<Units, { extended: Translator; symbols?: Translator }>;

const languages = ["es", "eo", "en"] as const;
type Languages = typeof languages[number];

const word: Record<Languages, ReturnType<typeof createSimplePlural>> = {
  es: (() => {
    const a = createSimplePlural("s", ["año", "mes", "semana", "día", "hora", "minuto", "segundo", "milisegundo"]);
    a.month.extended = (time: number) => simplePlural("es")(time, "mes");
    return a;
  })(),
  en: createSimplePlural("s", ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"]),
  eo: createSimplePlural("j", ["jaro", "monato", "semajno", "tago", "horo", "minuto", "sekundo", "milisekundo"]),
};

const separators: Record<Languages, string> = { es: "y", en: "and", eo: "kaj" };

interface Options {
  variant?: Variant;
  language?: keyof typeof word;
  separator?: string;
  andSeparator?: boolean;
}
export default function splitTime(
  ms: number | Date,
  { variant = "extended", language = "en", separator = ", ", andSeparator = true }: Options = {}
) {
  if (typeof ms !== "number") ms = +ms;
  const decimals = 100_000;
  ms = Math.round(ms * decimals) / decimals;

  const translate = (() => {
    const translator = word[language];
    return (unitName: Units, ms: number) =>
      (variant === "symbols" && translator[unitName].symbols
        ? translator[unitName].symbols!
        : translator[unitName].extended)(ms);
  })();

  if (ms < 1) return translate("millisecond", ms);

  const times: string[] = [];

  const unitEntries = Object.entries(UNITS) as Array<[Units, number]>;
  for (const [unitName, unitTime] of unitEntries) {
    if (ms >= unitTime) {
      if (unitName === "millisecond") times.push(translate(unitName, ms));
      else times.push(translate(unitName, Math.floor(ms / unitTime)));
    }

    ms = ((ms * decimals) % (unitTime * decimals)) / decimals;
  }

  return times.length >= 2
    ? `${times.slice(0, andSeparator ? -1 : undefined).join(separator)}` +
        (andSeparator ? ` ${separators[language]} ${times[times.length - 1]}` : "")
    : times[0];
}

export function getSplitter(options: Options = {}) {
  return (ms: number) => splitTime(ms, options);
}

export class SplitTime {
  options: Options = {};

  constructor(options: Options) {
    this.options = options;
  }

  splitTime(ms: number, options: Options = this.options) {
    return splitTime(ms, options);
  }

  getSplitter() {
    return (ms: number) => splitTime(ms, this.options);
  }
}
