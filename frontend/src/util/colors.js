export function getPrimaryColor() {
    return "#0B132B"; // Oxford blue
}

export function getSecondaryColor() {
    return "#1C2541"; // Space cadet
}

export function getTertiaryColor() {
    return "#3A506B"; // Indepencence
}
export function getQuaternaryColor() {
    return "#5BC0BE"; // Maximum blue green
}
export function getQuinaryColor() {
    return "#6FFFE9"; // Turqoise blue
}


export function getRandomColor() {
    let colors =  ["#FFBC42", "#D81159", "#8F2D56", "#218380", "#73D2DE"];
    let color = colors[Math.floor(Math.random() * colors.length)];
    return color;
}