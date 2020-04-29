export function getRandomColor() {
    let colors = ["#d84825", "#195e83", "#1979a9", "#e07b39", "#69bdd2", "#80391e", "#1c100b","#042f66","#b97455","#44bcd8"]
    let color = colors[Math.floor(Math.random() * colors.length)];
    return color;
}