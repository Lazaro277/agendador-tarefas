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
        for (let i = 1; i <= id; i++) {
            //recupera a despesa
            let tarefa = JSON.parse(localStorage.getItem(i))

            if (tarefa === null) {
                continue
            }
            tarefa.id = i
            tarefas.push(tarefa)
        }
        return tarefas
    }

    pesquisar(tarefa) {
        let tarefasFiltradas = Array()

        tarefasFiltradas = this.recuperarTodosRegistros()

        if (tarefa.nomeTarefa != '') {
            tarefasFiltradas = tarefasFiltradas.filter(t => t.nomeTarefa == tarefa.nomeTarefa)
        }
        if (tarefa.dataTarefa != '') {
            tarefasFiltradas = tarefasFiltradas.filter(t => t.dataTarefa == tarefa.dataTarefa)
        }
        if (tarefa.obsTarefa != '') {
            tarefasFiltradas = tarefasFiltradas.filter(t => t.obsTarefa == tarefa.obsTarefa)
        }
        if (tarefa.statusSelecionado != '') {
            tarefasFiltradas = tarefasFiltradas.filter(t => t.statusSelecionado == tarefa.statusSelecionado)
        }
        if (tarefa.prioridadeSelecionada != '') {
            tarefasFiltradas = tarefasFiltradas.filter(t => t.prioridadeSelecionada == tarefa.prioridadeSelecionada)
        }
        if (tarefa.categoriaSelecionada != '') {
            tarefasFiltradas = tarefasFiltradas.filter(t => t.categoriaSelecionada == tarefa.categoriaSelecionada)
        }
        return tarefasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

class Modal {
    constructor(title, cor, body, btn, btn2, btn2text, excluir = false, id) {
        this.title = title;
        this.cor = cor;
        this.body = body;
        this.btn = btn;
        this.btn2 = btn2;
        this.btn2text = btn2text
        this.excluir = excluir
        this.id = id
    }

    mostrarModal() {

        console.log(this.id)
        if (this.excluir == true) {
            document.getElementById("btnModal").onclick = () => {
                bd.remover(this.id)
                window.location.reload()
            }
        } else {
            document.getElementById("btn2Modal").onclick = () => {
                window.location.href = "index.html"
            }
        }

        document.getElementById("titleModal").innerHTML = this.title;
        document.getElementById("titleModal").className = "modal-title fs-5 text-" + this.cor;
        document.getElementById("bodyModal").innerHTML = this.body;
        document.getElementById("btnModal").innerHTML = this.btn;
        document.getElementById("btnModal").className = "btn btn-" + this.cor;
        document.getElementById("btn2Modal").innerHTML = this.btn2text;
        document.getElementById("btn2Modal").className = this.btn2;
        /* document.getElementById("btn2Modal").href = "index.html"; */

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
            "btn btn-secondary",
            "Sair",
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
    document.getElementById('nomeTarefaFiltro').value = ""
    document.getElementById('dataTarefaFiltro').value = ""
    document.getElementById('statuFiltro').value = "";
    document.getElementById('prioridadeFiltro').value = "";
    document.getElementById('categoriaFiltro').value = "";
    document.getElementById('obsTarefaFiltro').value = ""

    let status = document.querySelector('input[name="status"]:checked')
    if (status) status.checked = false

    let prioridade = document.querySelector('input[name="prioridade"]:checked')
    if (prioridade) prioridade.checked = false

    let categoria = document.querySelector('input[name="categoria"]:checked')
    if (categoria) categoria.checked = false
}

function carregaListaTarefas(tarefas = Array(), filtro = false) {

    if (tarefas.length == 0 && filtro == false) {
        tarefas = bd.recuperarTodosRegistros()
    }
    if (tarefas.length == 0 && filtro == false) {
        document.getElementById('tabelaTarefas').classList.add("d-none")
        document.getElementById('mensagemSemTarefasFiltro').classList.add("d-none")
        document.getElementById('mensagemSemTarefas').classList.remove("d-none")
    } else if (tarefas.length == 0 && filtro == true) {
        document.getElementById('mensagemSemTarefas').classList.add("d-none")
        document.getElementById('tabelaTarefas').classList.add("d-none")
        document.getElementById('mensagemSemTarefasFiltro').classList.remove("d-none")
    }
    else {
        document.getElementById('mensagemSemTarefas').classList.add("d-none")
        document.getElementById('mensagemSemTarefasFiltro').classList.add("d-none")
        document.getElementById('tabelaTarefas').classList.remove("d-none")
    }

    let listaTarefas = document.getElementById('listaTarefas')
    listaTarefas.innerHTML = ''

    tarefas.forEach(function (t) {

        let linha = listaTarefas.insertRow()

        linha.insertCell(0).innerHTML = t.dataTarefa
        linha.insertCell(1).innerHTML = t.nomeTarefa
        linha.insertCell(2).innerHTML = t.statusSelecionado
        linha.insertCell(3).innerHTML = t.prioridadeSelecionada
        linha.insertCell(4).innerHTML = t.categoriaSelecionada
        if (t.obsTarefa == '') {
            linha.insertCell(5).innerHTML = '---'
        } else {
            linha.insertCell(5).innerHTML = t.obsTarefa
        }
        let btn = document.createElement("button")
        btn.className = 'btn text-danger p-0'
        btn.innerHTML = '<i class="bi bi-trash3-fill"></i>'
        btn.id = `id_tarefa_${t.id}`
        btn.onclick = function () {
            let id = this.id.replace('id_tarefa_', '')
            let modal = new Modal(
                "Excluir tarefa",
                "danger",
                "Deseja excluir essa tarefa?",
                "Excluir",
                "btn btn-secondary",
                "Cancelar",
                true,
                id
            );
            modal.mostrarModal();

        }
        linha.insertCell(6).append(btn)
    })
}

function pesquisarTarefa() {
    let nomeTarefa = document.getElementById('nomeTarefaFiltro').value
    let dataTarefa = document.getElementById('dataTarefaFiltro').value.split('-').reverse().join('/')
    let statusSelecionado = document.getElementById('statuFiltro').value;
    let prioridadeSelecionada = document.getElementById('prioridadeFiltro').value;
    let categoriaSelecionada = document.getElementById('categoriaFiltro').value;
    let obsTarefa = document.getElementById('obsTarefaFiltro').value

    let tarefa = new Tarefa(
        nomeTarefa,
        dataTarefa,
        statusSelecionado,
        prioridadeSelecionada,
        categoriaSelecionada,
        obsTarefa
    )

    let tarefas = bd.pesquisar(tarefa)

    this.carregaListaTarefas(tarefas, true)
}

























function entrar() {
    window.location.href = "index.html"
}
