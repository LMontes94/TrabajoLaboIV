let horas;
let minutos;
let segundos;

function comenzarReloj(){
    const tiempou = new Date();
    horas = dosDigitos(tiempou.getHours());
    minutos = dosDigitos(tiempou.getMinutes());
    segundos = dosDigitos(tiempou.getSeconds());
}


let tiempo = setInterval(() => {
    if (segundos >= 59) {
        segundos = 0;
        minutos++;
        if (minutos >= 59) {
            minutos = 0;
            horas++;
            if (horas >= 24) {
                horas = 0;
            }
        }
    }
    else {
        segundos++;
    }
    hr_rotation = 30 * horas + minutos / 2;
    min_rotation = 6 * minutos;
    sec_rotation = 6 * segundos;
            
    hour.style.transform = `rotate(${hr_rotation}deg)`;
    minute.style.transform = `rotate(${min_rotation}deg)`;
    second.style.transform = `rotate(${sec_rotation}deg)`;

    document.getElementById("digitalClock").innerHTML = dosDigitos(horas) + ":" + dosDigitos(minutos) + ":" + dosDigitos(segundos);
}, 1000);

function dosDigitos(num) {
    if (num < 10) {
        return "0" + num;
    }
    return num;
}

function obtenerHorario(string){
    $.getJSON(string, function(data){
        horas = parseInt(data.datetime.substring(11,13));
        minutos = parseInt(data.datetime.substring(14,16));
        segundos = parseInt(data.datetime.substring(17,19));
    })
}

comenzarReloj();