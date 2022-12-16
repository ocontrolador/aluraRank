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
                    let hoje = fragment
                        .querySelector('.pointsGrid-cell:last-child > span > strong')
                        .innerText;
                    let hojeFormatado = (hoje) ? new Intl.NumberFormat('pt-BR').format(parseInt(hoje)) : 0;
                    let pontos = fragment
                        .querySelectorAll('.pointsGrid-cell--high-score > span > strong');
                    let media = calcularMedia(pontos);
                    document.getElementById(tipo).innerText = hojeFormatado;
                    document.getElementById('media').innerText = media;
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
    let total = pontos.length;
    pontos.forEach(ponto => soma += parseInt(ponto.innerText));
    let numeroFormatado = new Intl.NumberFormat('pt-BR').format(Math.round(soma / total));
    return numeroFormatado;
}

function Continuar() {
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
            let curso = fragment.querySelector('.big-card__button').href;
            let cursoPosicao = curso.indexOf('course');
            curso = ( cursoPosicao != -1)? curso.substring(cursoPosicao) : '';
            link += curso;
            botaoContinuar.addEventListener('click', () => window.open(link, '_blank'));
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
                .querySelectorAll('.profile-info-name')[1].innerText;
            document.getElementById('usuario').innerText = usuario;
            document.getElementById('link').href = `https://cursos.alura.com.br/user/${login}`;
            Continuar();
            getRank(`https://cursos.alura.com.br/user/${login}`, login);
        })
        .catch(function (err) {
            console.info(err);
            document.getElementById('login').innerHTML = '<a href="https://cursos.alura.com.br/" target="_blank" id="link">Login Alura</a>';
            document.getElementById('rank').innerHTML = '<br><span class="red">NÃO LOGADO!</span>';
        });
}

getUser(urlAlura);

