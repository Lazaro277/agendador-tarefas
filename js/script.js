class Tarefa {
    constructor(nomeTarefa, dataTarefa, statusSelecionado, prioridadeSelecionada, categoriaSelecionada, obsTarefa
    ) {
        this.nomeTarefa = nomeTarefa
        this.dataTarefa = dataTarefa
        this.statusSelecionado = statusSelecionado
        this.prioridadeSelecionada = prioridadeSelecionada
        this.categoriaSelecionada = categoriaSelecionada
        this.obsTarefa = obsTarefa
    }

    validarDados() {
        for (let i in this) {
            if (i !== 'obsTarefa') {
                if (this[i] == undefined || this[i] == '' || this[i] == null) {
                    return false
                }
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(t) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(t))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let tarefas = Array()

        let id = localStorage.getItem('id')

        //recupera todas as tarefas armazenadas em localStorage
        for(let i = 1; i <= id; i++) {
            //recupera a despesa
            let tarefa = JSON.parse(localStorage.getItem(i))
            
            if(tarefa === null) {
                continue
            }

            tarefas.push(tarefa)
        }
        return tarefas
    }
}

let bd = new Bd()

class Modal {
    constructor(title, cor, body, btn, btn2) {
        this.title = title;
        this.cor = cor;
        this.body = body;
        this.btn = btn;
        this.btn2 = btn2;
    }

    mostrarModal() {
        document.getElementById("titleModal").innerHTML = this.title;
        document.getElementById("titleModal").className =
            "modal-title fs-5 text-" + this.cor;
        document.getElementById("bodyModal").innerHTML = this.body;
        document.getElementById("btnModal").innerHTML = this.btn;
        document.getElementById("btnModal").className = "btn btn-" + this.cor;
        document.getElementById("btn2Modal").innerHTML = "Sair";
        document.getElementById("btn2Modal").className = this.btn2;
        document.getElementById("btn2Modal").href = "index.html";

        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalRegistraTarefa'))
        modal.show()
    }
}

function cadastrarTarefa() {
    let nomeTarefa = document.getElementById('nomeTarefa')
    let dataTarefa = document.getElementById('dataTarefa')
    let statusSelecionado = document.querySelector('input[name="status"]:checked');
    let prioridadeSelecionada = document.querySelector('input[name="prioridade"]:checked');
    let categoriaSelecionada = document.querySelector('input[name="categoria"]:checked');
    let obsTarefa = document.getElementById('obsTarefa')

    let tarefa = new Tarefa(
        nomeTarefa.value,
        dataTarefa.value.split('-').reverse().join('/'),
        statusSelecionado ? statusSelecionado.value : '',
        prioridadeSelecionada ? prioridadeSelecionada.value : '',
        categoriaSelecionada ? categoriaSelecionada.value : '',
        obsTarefa.value
    )

    if (tarefa.validarDados()) {
        bd.gravar(tarefa)
        let modal = new Modal(
            "Registrado com sucesso",
            "success",
            "Tarefa foi cadastrada com sucesso!",
            "Nova tarefa",
            "btn btn-secondary"
        );
        limparCampos()
        modal.mostrarModal();
    } else {
        let modal = new Modal(
            "Existem campos inválidos",
            "danger",
            "Verifique se todos os campos foram preenchidos corretamente!",
            "Voltar e corrigir",
            "d-none"
        );
        modal.mostrarModal();
    }
}

function limparCampos() {
    document.getElementById('nomeTarefa').value = ""
    document.getElementById('dataTarefa').value = ""
    document.getElementById('obsTarefa').value = ""

    let status = document.querySelector('input[name="status"]:checked')
    if (status) status.checked = false

    let prioridade = document.querySelector('input[name="prioridade"]:checked')
    if (prioridade) prioridade.checked = false

    let categoria = document.querySelector('input[name="categoria"]:checked')
    if (categoria) categoria.checked = false
}

function carregaListaTarefas() {
    let tarefas = Array()

    tarefas = bd.recuperarTodosRegistros()

    if(tarefas.length == 0) {
        document.getElementById('mensagemSemTarefas').classList.remove("d-none")  
    }else {
        document.getElementById('tabelaTarefas').classList.remove("d-none")  
    }

    let listaTarefas = document.getElementById('listaTarefas')

    tarefas.forEach(function(t) {
        console.log(t)

        let linha = listaTarefas.insertRow()

        linha.insertCell(0).innerHTML = t.dataTarefa
        linha.insertCell(1).innerHTML = t.nomeTarefa
        linha.insertCell(2).innerHTML = t.statusSelecionado
        linha.insertCell(3).innerHTML = t.prioridadeSelecionada
        linha.insertCell(4).innerHTML = t.categoriaSelecionada
    })
}

























function entrar() {
    window.location.href = "index.html"
}
