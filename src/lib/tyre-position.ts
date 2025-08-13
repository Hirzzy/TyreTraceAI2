
export type TyrePos = "1L"|"1R"|"2L"|"2R";

export type TyreHuman = {
  code: "avg"|"avd"|"arg"|"ard";
  long: "avant gauche"|"avant droit"|"arrière gauche"|"arrière droit";
  side: "gauche"|"droite";
  axle: 1|2;
  frontRear: "avant"|"arrière";
};

export function toHuman(pos: TyrePos): TyreHuman {
  switch (pos) {
    case "1L": return { code:"avg", long:"avant gauche",  side:"gauche", axle:1, frontRear:"avant" };
    case "1R": return { code:"avd", long:"avant droit",   side:"droite", axle:1, frontRear:"avant" };
    case "2L": return { code:"arg", long:"arrière gauche", side:"gauche", axle:2, frontRear:"arrière" };
    case "2R": return { code:"ard", long:"arrière droit",  side:"droite", axle:2, frontRear:"arrière" };
  }
}
