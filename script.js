//const tituloAlura = window.document.querySelector('.banner-title');

//tituloAlura.innerText = 'SAID'

let urlAlura = 'https://cursos.alura.com.br/dashboard';

function getRank(urlOrigem, login) {
    const tiposRank = ["day", "full", "monthly", "weekly"];
    tiposRank.forEach(function (tipo) {
        let url = `${urlOrigem}/${(tipo == 'day') ? '' : 'rank/' + tipo}`
        fetch(url)
            .then(res => res.text())
            .then(text => {
                let fragment = document.createElement('div');
                fragment.innerHTML = text;
                return fragment;
            })
            .then(fragment => {
                if (tipo == 'day') {
                    let pontosData = [
                        fragment.querySelector('.pointsGrid-cell:first-child > span').innerText,
                        fragment.querySelector('.pointsGrid-cell:last-child > span').innerText
                    ]; 
                    let hoje = pontosHoje(pontosData);
                    let hojeFormatado = new Intl.NumberFormat('pt-BR').format(hoje);
                    let pontos = fragment
                        .querySelectorAll('.profile-title-activity + .pointsGrid > .pointsGrid-cell > span > strong');
                    // .querySelectorAll('.pointsGrid-cell > span > strong');
                    let media = pontos.length? calcularMedia(pontos) : 0;
                    let diasEstudados = pontos.length;
                    console.log('Pontos',pontos);
                    // insere no html
                    document.getElementById(tipo).innerText = hojeFormatado;
                    document.getElementById('media').innerText = media;
                    document.getElementById('diasEstudo').innerText = `${diasEstudados} de 30` ;
                } else {
                    let ranking = fragment
                        .querySelector('.rankPage-position-myself > strong')
                        .innerText
                        .replace(/[\r\n ]/g, '');
                    let pontos = fragment
                        .querySelector('.rankPage-position-myself > div > span:last-child > strong')
                        .innerText
                        .replace(/[\r\n ]/g, '')
                        .replace(',', '.');
                    document.getElementById(tipo).innerHTML = `<a href="https://cursos.alura.com.br/user/${login}/rank/${tipo}" target="_blank">${pontos} (${ranking})</a>`;
                }
            })
            .catch(function (err) {
                console.info(err);
            });
    });
}

function calcularMedia(pontos) {
    let soma = 0;
    let total = pontos.length ? pontos.length : 1;
    pontos.forEach(ponto => soma += (ponto.innerText)? parseInt(ponto.innerText): 0);
  let numeroFormatado = new Intl.NumberFormat('pt-BR').format(Math.round(soma / total));
    return numeroFormatado;
}

function pontosHoje(data){    
    let hoje = new Date().toLocaleDateString('pt-BR');
    let dataPattern = /\d{2}\/\d{2}\/\d{4}/;
    let pontosPattern = /GANHOU (\d+)/i;
    let pontos = 0;
    if ( hoje == data[0].match(dataPattern)[0])
        if ( data[0].match(pontosPattern) != null ) 
            return data[0].match(pontosPattern)[1];
        else return pontos;
    if ( data[1].match(pontosPattern) != null ) 
        return data[1].match(pontosPattern)[1];
    return pontos;
}

function ContinuarCurso() {
    let url = 'https://cursos.alura.com.br/dashboard';
    let botaoContinuar = document.getElementById("continuar");
    fetch(url)
        .then(res => res.text())
        .then(text => {
            let fragment = document.createElement('div');
            fragment.innerHTML = text;
            return fragment;
        })
        .then(fragment => {
            let link = 'https://cursos.alura.com.br/';
            let cursoNome = fragment.querySelector('.big-card__name');
            cursoNome = (cursoNome)? cursoNome.innerText: "Contitunar o curso";
            cursoNome = cursoNome.replace(': ',':\n');
            let cursoHref = fragment.querySelector('.big-card__button').href;
            let cursoPosicao = cursoHref.indexOf('course');
            cursoHref = ( cursoPosicao != -1)? cursoHref.substring(cursoPosicao) : '';
            link += cursoHref;
            botaoContinuar.addEventListener('click', () => window.open(link, '_blank'));
            botaoContinuar.classList.remove('esconde');
            botaoContinuar.title = cursoNome;
        })
        .catch(function (err) {
            console.info(err);
        });
}

function getUser(url) {
    fetch(url)
        .then(res => res.text())
        .then(text => {
            let fragment = document.createElement('div');
            fragment.innerHTML = text;
            return fragment;
        })
        .then(fragment => {
            let login = fragment
                .querySelector('[data-username]').getAttribute("data-username");
            let usuario = fragment
                .querySelector('[class$=avatar]').alt.substring(8);
                //.querySelector('.profile__info-name').innerText;
            document.getElementById('usuario').innerText = usuario;
            document.getElementById('link').href = `https://cursos.alura.com.br/user/${login}`;
            ContinuarCurso();
            getRank(`https://cursos.alura.com.br/user/${login}`, login);
        })
        .catch(function (err) {
            console.info(err);
            document.getElementById('login').innerHTML = '<a href="https://cursos.alura.com.br/" target="_blank" id="link">Login Alura</a>';
            document.getElementById('rank').innerHTML = '<br><span class="red">NÃO LOGADO!</span>';
        });
}

getUser(urlAlura);

