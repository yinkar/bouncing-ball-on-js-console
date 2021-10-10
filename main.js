let width = 25;
let height = 20;
let floor = [' ', ' ', ' ', '/'];
let character = '╬';
let frame_rate = 7;
let track_active = true;
let track = ['·', '.', '-', '¨', ' '];
let frame = ['▄', '█', '▀'];
let verbose = true;

function rand(begin, end) {
    if (end === undefined) {
        end = begin;
        begin = 0;
    }

    return parseInt(Math.floor(Math.random() * (end - begin)) + begin);
}

position_x = parseInt(width / 2);
position_y = parseInt(height / 2);

let dy = rand(1, 3) * [1, -1][rand(0, 2)];
let dx = rand(1, 3) * [1, -1][rand(0, 2)];

let speed = (Math.sqrt(Math.pow(dy, 2) +  Math.pow(dx, 2)) * frame_rate).toFixed(2);

const sign = x => [1, -1][+(0 > x)];

const set_area = (width, height, character) => {
    const area = [];

    for (let i = 0; i < height; i++) {
        area.push([]);
        for (let j = 0; j < width; j++) {
            area[i].push(floor[rand(0, floor.length)]);
        }
    }

    return area;
}

const draw = (area, isCrash, bounce) => {
    const fill_area = [];

    for (i = 0; i < area.length; i++) {
        fill_area.push(Array.from([]));
        for (j = 0; j < area[0].length; j++) {
            fill_area[i][j] = area[i][j] + floor[rand(0, floor.length - 1)];
        }
    }


    fill_area[position_y][position_x] = character;
    fill_area[position_y][position_x - 1] = ' ' + character + ' ';
    fill_area[position_y][position_x + 1] = ' ' + character;
    fill_area[position_y - 1][position_x] = character;
    fill_area[position_y + 1][position_x] = character;
    fill_area[position_y + 1][position_x + 1] = ' ' + '/';
    fill_area[position_y + 1][position_x - 1] = '\\' + ' '  + character;
    fill_area[position_y - 1][position_x - 1] = '/' + ' ' + character;
    fill_area[position_y - 1][position_x + 1] = ' ' + '\\';


    let track_x = (0 < (position_x - sign(dx) * 3)) && ((position_x - sign(dx) * 3) < fill_area[0].length);
    let track_y = (0 < (position_y - sign(dy) * 3)) && ((position_y - sign(dy) * 3) < fill_area.length);

    if (track_x && track_active) {
        fill_area[position_y][position_x - sign(dx) * 3] = track[rand(0, track.length - 1)].repeat(2);
    }
    if (track_y && track_active) {
        fill_area[position_y - sign(dy) * 3][position_x] = track[rand(0, track.length - 1)].repeat(2);
    }
    if (track_y && track_y && track_active) {
        fill_area[position_y - sign(dy) * 3][position_x - sign(dx) * 3] = track[rand(0, track.length - 1)].repeat(2);
    }

    let render = '\n';

    render += frame[0] + frame[0].repeat(fill_area[0].length * 2) + frame[0] + '\n';

    for (let i = 0; i < fill_area.length; i++) {
        render += frame[1];
        for (let j = 0; j < fill_area[0].length; j++) {
            render += fill_area[i][j];
        }
        render += frame[1] + '\n';
    }

    render += frame[2] + frame[2].repeat(fill_area[0].length * 2) + frame[2] + '\n\n';

    render += `Bounce: ${bounce}`.padEnd(15, ' ') + '\t';

    if (verbose) {
        render += `Speed: ${speed}`.padEnd(15, ' ') + '\n';
        render += `Character: ${character}`.padEnd(15, ' ') + '\t';
        render += `Frame Rate: ${frame_rate}`.padEnd(15, ' ') + '\t';
        render += `X: ${position_x}`.padEnd(15, ' ') + '\t';
        render += `Y: ${position_y}`.padEnd(15, ' ') + '\n';
        render += `Width: ${width}`.padEnd(15, ' ') + '\t';
        render += `Height: ${height}`.padEnd(15, ' ') + '\t';
        render += `dx: ${dx}`.padEnd(15, ' ') + '\t';
        render += `dy: ${dy}`.padEnd(15, ' ') + '\t';
    }

    if (isCrash) {
        console.log(`%c ${render}`, 'color: crimson;');
    }
    else {
        console.log(render);
    }

}

let isCrash = false;

let bounce = 0;

const loop = setInterval(() => {

    console.clear();

    area = set_area(width, height, character);
    draw(area, isCrash, bounce);

    isCrash = false;

    let crashX = (position_x + dx) > (area[0].length - 2) || (position_x + dx) < 1;
    let crashY = (position_y + dy) > (area.length - 2) || (position_y + dy) < 1;

    if (crashX) {
        dx = -1 * dx;
        isCrash = true;
    }

    if (crashY) {
        dy = -1 * dy;
        isCrash = true;
    }

    if (crashX || crashY) {
        bounce++;
    }

    position_x += dx;
    position_y += dy;
}, 1000 / frame_rate);