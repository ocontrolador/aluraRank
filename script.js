let urlAlura = 'https://cursos.alura.com.br/dashboard';

function getRank(urlOrigem, login) {
    const tiposRank = ["day", "full", "monthly", "weekly"];
    tiposRank.forEach( function(tipo){
        let url = `${urlOrigem}/${(tipo == 'day')? '' : 'rank/' + tipo}`
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
                    let total = fragment
                        .querySelector('.profile-info-item-points > strong')
                        .innerText;
                    document.getElementById(tipo).innerText = hoje;
                    // document.getElementById('total').innerText = total.replace(/(\d{3})?(\d{3})?/, "$1.$2");
                } else {
                    let ranking = fragment
                        .querySelector('.rankPage-position-myself > strong')
                        .innerText
                        .replace(/[\r\n ]/g, ''); 
                    let pontos = fragment
                        .querySelector('.rankPage-position-myself > div > span:last-child > strong')
                        .innerText
                        .replace(/[\r\n ]/g, '')
                        .replace(',','.'); 
                    document.getElementById(tipo).innerHTML = `<a href="https://cursos.alura.com.br/user/${login}/rank/${(tipo == 'full')? '': tipo}" target="_blank">${pontos} (${ranking})</a>`;
                }
            })
            .catch(function(err) {
                console.info(err);                
            });
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
            getRank(`https://cursos.alura.com.br/user/${login}`, login);            
        })
        .catch(function(err) {
            console.info(err);
            document.getElementById('rank').innerHTML = '<br><span class="red">NÃO LOGADO!</span>';
        });
}

getUser(urlAlura);

