class Tarefa {
    constructor(nomeTarefa, dataTarefa, statusSelecionado, prioridadeSelecionada, categoriaSelecionada, obsTarefa, emailUser
    ) {
        this.nomeTarefa = nomeTarefa
        this.dataTarefa = dataTarefa
        this.statusSelecionado = statusSelecionado
        this.prioridadeSelecionada = prioridadeSelecionada
        this.categoriaSelecionada = categoriaSelecionada
        this.obsTarefa = obsTarefa
        this.emailUser = emailUser
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

class Usuario {
    constructor(cadastroNome, cadastroDataNascimento, cadastroEmail, cadastroSenha) {
        this.cadastroNome = cadastroNome
        this.cadastroDataNascimento = cadastroDataNascimento
        this.cadastroEmail = cadastroEmail
        this.cadastroSenha = cadastroSenha
    }

    validarDados() {
        let isValid = 'ok'
        let cadastroEmail = document.getElementById('cadastroEmail')

        // Validar Nome
        if (this.cadastroNome == undefined || this.cadastroNome == "" || this.cadastroNome == null) {
            isValid = 'nome'
            return isValid
        }

        const nomeRegex = /^[a-zA-Z\u00C0-\u00FF\s]+$/
        if (!nomeRegex.test(this.cadastroNome)) {
            isValid = 'nomeInvalido'
            return isValid
        }

        // Validar Data
        if (!this.cadastroDataNascimento == undefined || this.cadastroDataNascimento == "" || this.cadastroDataNascimento == null) {
            isValid = 'dataNascimento'
            return isValid
        }

        let dataSeparada = this.cadastroDataNascimento.split('/')
        if (dataSeparada[2] < 1925 || dataSeparada[2] > 2013) {
            isValid = 'dataNascimentoInvalido'
            return isValid
        }

        // Validar email null
        if (!this.cadastroEmail == undefined || this.cadastroEmail == "" || this.cadastroEmail == null) {
            isValid = 'email'
            return isValid
        }

        // Validar Email com Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!this.cadastroEmail || !emailRegex.test(this.cadastroEmail)) {
            isValid = 'emailInvalido'
            return isValid
        }

        let id = localStorage.getItem('id')
        //recupera todas as tarefas armazenadas em localStorage
        for (let i = 1; i <= id; i++) {
            let usuario = JSON.parse(localStorage.getItem(i))

            if (usuario === null) {
                continue
            }
            if (usuario.cadastroEmail == cadastroEmail.value) {
                isValid = 'emailExiste'
                return isValid
            }
        }

        // Validar Senha null
        if (!this.cadastroSenha == undefined || this.cadastroSenha == "" || this.cadastroSenha == null) {
            isValid = 'senha'
            return isValid
        }

        // Validar complexidade da senha
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
        if (!senhaRegex.test(this.cadastroSenha)) {
            isValid = 'senhaInvalida'
            return isValid
        }

        let senhaConfirmacao = document.getElementById("confirmaCadastroSenha").value

        // Validar Senha confirmação
        if (!senhaConfirmacao == undefined || senhaConfirmacao == "" || senhaConfirmacao == null) {
            isValid = 'senhaConfirmacaonull'
            return isValid
        }

        if (this.cadastroSenha !== senhaConfirmacao) {
            isValid = 'senhaNaoConfere'
            return isValid
        }


        return isValid
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
        let emailUser = localStorage.getItem('usuarioExisteEmail')

        let id = localStorage.getItem('id')

        //recupera todas as tarefas armazenadas em localStorage
        for (let i = 1; i <= id; i++) {
            //recupera a despesa
            let tarefa = JSON.parse(localStorage.getItem(i))

            if (tarefa === null) {
                continue
            }
            if (tarefa.dataTarefa == undefined) {
                continue
            }
            if (tarefa.emailUser !== emailUser) {
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
    constructor(title, cor, body, btn, btn2, btn2text, confirma, id) {
        this.title = title;
        this.cor = cor;
        this.body = body;
        this.btn = btn;
        this.btn2 = btn2;
        this.btn2text = btn2text
        this.confirma = confirma
        this.id = id
    }

    mostrarModal() {

        if (this.confirma == 'excluirTrue') {
            document.getElementById("btnModal").onclick = () => {
                bd.remover(this.id)
                window.location.reload()
            }
        } else if (this.confirma == 'cadastrarTrue') {
            document.getElementById("btnModal").onclick = () => {
                window.location.href = "login.html"
            }
        } else if (this.confirma == 'sairTrue') {
            document.getElementById("btn2Modal").onclick = () => {
                window.location.href = "index.html"
            }
        } else if (this.confirma == 'loginTrue') {
            document.getElementById("btnModal").onclick = () => {
                window.location.href = "cadastrar.html"
            }
        }

        document.getElementById("titleModal").innerHTML = this.title;
        document.getElementById("titleModal").className = "modal-title fs-5 text-" + this.cor;
        document.getElementById("bodyModal").innerHTML = this.body;
        document.getElementById("bodyModal").className = "text-start ms-3 my-2";
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
    let emailUser = localStorage.getItem('usuarioExisteEmail')

    let tarefa = new Tarefa(
        nomeTarefa.value,
        dataTarefa.value.split('-').reverse().join('/'),
        statusSelecionado ? statusSelecionado.value : '',
        prioridadeSelecionada ? prioridadeSelecionada.value : '',
        categoriaSelecionada ? categoriaSelecionada.value : '',
        obsTarefa.value,
        emailUser
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
            'sairTrue'
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
function cadastrarUsuario() {
    let cadastroNome = document.getElementById('cadastroNome')
    let cadastroDataNascimento = document.getElementById('cadastroDataNascimento')
    let cadastroEmail = document.getElementById('cadastroEmail');
    let cadastroSenha = document.getElementById('cadastroSenha');

    let usuario = new Usuario(
        cadastroNome.value,
        cadastroDataNascimento.value.split('-').reverse().join('/'),
        cadastroEmail.value,
        cadastroSenha.value
    )


    if (usuario.validarDados() == 'ok') {
        bd.gravar(usuario)
        let modal = new Modal(
            "Usuário cadastrado",
            "success",
            "Usuário cadastrado com sucesso!",
            "Login",
            "d-none",
            null,
            'cadastrarTrue'

        );
        modal.mostrarModal();
        limparCamposCadastrar()
    } else if (usuario.validarDados() == 'nome') {
        let modal = new Modal(
            "Preencha seu nome",
            "danger",
            "Verifique se o Nome foi preenchido!",
            "Voltar e corrigir",
            "d-none"
        );
        modal.mostrarModal();
    } else if (usuario.validarDados() == 'nomeInvalido') {
        let modal = new Modal(
            "Nome inválido",
            "danger",
            "O nome deve conter apenas letras!",
            "Voltar e corrigir",
            "d-none"
        );
        modal.mostrarModal();
    } else if (usuario.validarDados() == 'dataNascimento') {
        let modal = new Modal(
            "Informe uma Data de Nascimento",
            "danger",
            "Verifique se a Data de Nascimento foi preenchida!",
            "Voltar e corrigir",
            "d-none"
        );
        modal.mostrarModal();
    } else if (usuario.validarDados() == 'dataNascimentoInvalido') {
        let modal = new Modal(
            "Data de Nascimento inválida",
            "danger",
            "Verifique se a Data de Nascimento foi preenchida corretamente!",
            "Voltar e corrigir",
            "d-none"
        );
        modal.mostrarModal();
    } else if (usuario.validarDados() == 'email') {
        let modal = new Modal(
            "Informe seu e-mail",
            "danger",
            "Verifique se o E-mail foi preenchido!",
            "Voltar e corrigir",
            "d-none"
        );
        modal.mostrarModal();
    } else if (usuario.validarDados() == 'emailInvalido') {
        let modal = new Modal(
            "Informe um e-mail válido",
            "danger",
            "Verifique se o E-mail foi preenchido corretamente!",
            "Voltar e corrigir",
            "d-none"
        );
        modal.mostrarModal();
    } else if (usuario.validarDados() == 'emailExiste') {
        let modal = new Modal(
            "E-mail já cadastrado",
            "success",
            "E-mail já registrado em nosso sistema!",
            "Login",
            "btn btn-secondary",
            "Voltar",
            'cadastrarTrue'
        );
        modal.mostrarModal();
    } else if (usuario.validarDados() == 'senha') {
        let modal = new Modal(
            "Você deve informar uma senha",
            "danger",
            "Verifique se a senha foi preenchida!",
            "Voltar e corrigir",
            "d-none"
        );
        modal.mostrarModal();
    } else if (usuario.validarDados() == 'senhaInvalida') {
        let modal = new Modal(
            "Senha inválida",
            "danger",
            "A senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial!",
            "Voltar e corrigir",
            "d-none"
        );
        modal.mostrarModal();
    } else if (usuario.validarDados() == 'senhaConfirmacaonull') {
        let modal = new Modal(
            "Confirme sua senha",
            "danger",
            "Você deve confirmar sua senha!",
            "Voltar e corrigir",
            "d-none"
        );
        modal.mostrarModal();
    } else if (usuario.validarDados() == 'senhaNaoConfere') {
        let modal = new Modal(
            "As senhas não conferem",
            "danger",
            "Verifique se as senhas são iguais!",
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

function limparCamposCadastrar() {
    document.getElementById('cadastroNome').value = ""
    document.getElementById('cadastroDataNascimento').value = ""
    document.getElementById('cadastroEmail').value = ""
    document.getElementById('cadastroSenha').value = ""
    document.getElementById('confirmaCadastroSenha').value = ""
}

function carregaListaTarefas(tarefas = Array(), filtro = false) {

    let nomeUser = localStorage.getItem('nomeUser')
    let usuarioExisteEmail = localStorage.getItem('usuarioExisteEmail')
    let dataNascimentoUser = localStorage.getItem('dataNascimentoUser')
    nomeUser = nomeUser.charAt(0).toUpperCase() + nomeUser.slice(1);
    document.getElementById('nomeMeuPerfil').value = nomeUser
    document.getElementById('dataNascimentoMeuPerfil').value = dataNascimentoUser
    document.getElementById('emailMeuPerfil').value = usuarioExisteEmail

    // Carregar "Sobre mim" do usuário logado
    let id = localStorage.getItem('id')
    for (let i = 1; i <= id; i++) {
        let usuario = JSON.parse(localStorage.getItem(i))
        if (usuario && usuario.cadastroEmail === usuarioExisteEmail) {
            document.getElementById('sobreMimMeuPerfil').value = usuario.sobreMim || ''
            
            // Carregar foto de perfil salva do usuário
            if (usuario.fotoPerfil) {
                let imgNav = document.querySelector('.navbar-collapse img');
                if(imgNav) imgNav.src = usuario.fotoPerfil;
                let imgModal = document.getElementById('imgPerfilModal');
                if(imgModal) imgModal.src = usuario.fotoPerfil;
            }
            break
        }
    }

    nomeUser = nomeUser.split(' ')
    document.getElementById('nomeUser').innerHTML = nomeUser[0]

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
        if (t.dataTarefa != undefined) {

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
                    'excluirTrue',
                    id
                );
                modal.mostrarModal();

            }
            linha.insertCell(6).append(btn)
        }
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
    let usuarios = Array()
    let email = document.getElementById('email')
    let senha = document.getElementById('senha')
    let usuarioExisteEmail

    let id = localStorage.getItem('id')


    //recupera todas as tarefas armazenadas em localStorage
    for (let i = 1; i <= id; i++) {
        //recupera a despesa
        let usuario = JSON.parse(localStorage.getItem(i))
        usuarioExisteEmail = null

        if (usuario === null) {
            continue
        }

        if (usuario.dataTarefa != undefined) {
            continue
        }

        if (email.value == '') {
            usuarioExisteEmail = undefined
            let modal = new Modal(
                "Informe um e-mail",
                "danger",
                "Primeiro informe um e-mail para continuar!",
                "Cadastrar",
                "btn btn-secondary",
                "Tentar novamente",
                'loginTrue'
            );
            modal.mostrarModal();
            continue
        }

        if (usuario.cadastroEmail === email.value) {
            usuarioExisteEmail = usuario.cadastroEmail
            if (usuario.cadastroSenha === senha.value) {
                localStorage.setItem('usuarioExisteEmail', usuarioExisteEmail)
                localStorage.setItem('nomeUser', usuario.cadastroNome)
                localStorage.setItem('dataNascimentoUser', usuario.cadastroDataNascimento)
                // A foto será carregada pelo carregaListaTarefas no index
                window.location.href = "index.html"
            } else {
                let modal = new Modal(
                    "Usuário ou senha incorreto",
                    "danger",
                    "Confira seus dados e tente novamente!",
                    "Cadastrar",
                    "btn btn-secondary",
                    "Tentar novamente"
                );
                modal.mostrarModal();
                break
            }
        }

        usuario.id = i
        usuarios.push(usuario)

    }

    if (usuarioExisteEmail === null) {
        let modal = new Modal(
            "Usuário não encontrado",
            "danger",
            "Clique em cadastrar para fazer o seu cadastro!",
            "Cadastrar",
            "btn btn-secondary",
            "Tentar novamente",
            'loginTrue'
        );
        modal.mostrarModal();
    }


}

function atualizarFotoPerfil(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            // Atualiza a imagem no modal
            document.getElementById('imgPerfilModal').src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function removerFotoPerfil() {
    let fotoPadrao = 'img/foto-de-perfil-padrao.jpg';
    document.getElementById('imgPerfilModal').src = fotoPadrao;
    document.getElementById('inputFotoPerfil').value = ''; // Limpa o input file
}

function salvarPerfil() {
    let imgModal = document.getElementById('imgPerfilModal');
    let src = imgModal.src;
    let fotoPadrao = 'img/foto-de-perfil-padrao.jpg';
    
        // Salvar "Sobre mim" nos dados do usuário
        let sobreMim = document.getElementById('sobreMimMeuPerfil').value
        let emailUser = localStorage.getItem('usuarioExisteEmail')
        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {
            let usuario = JSON.parse(localStorage.getItem(i))
            if (usuario && usuario.cadastroEmail === emailUser) {
                usuario.sobreMim = sobreMim

                // Salvar foto no objeto do usuário
                if (src.includes(fotoPadrao)) {
                    delete usuario.fotoPerfil;
                } else {
                    usuario.fotoPerfil = src;
                }

                localStorage.setItem(i, JSON.stringify(usuario))
                break
            }
        }

    // Atualiza a navbar imediatamente
    let imgNav = document.querySelector('.navbar-collapse img');
    if (imgNav) imgNav.src = src;
    
    // Fecha o modal
    let modalElement = document.getElementById('modalPerfil');
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
    window.location.reload()
}

// Reseta a imagem do modal ao fechar se não tiver salvo (descarta alterações)
document.getElementById('modalPerfil').addEventListener('hidden.bs.modal', function () {
    let emailUser = localStorage.getItem('usuarioExisteEmail')
    let id = localStorage.getItem('id')
    let fotoSalva = null

    for (let i = 1; i <= id; i++) {
        let usuario = JSON.parse(localStorage.getItem(i))
        if (usuario && usuario.cadastroEmail === emailUser) {
            fotoSalva = usuario.fotoPerfil
            break
        }
    }

    let fotoPadrao = 'img/foto-de-perfil-padrao.jpg';
    document.getElementById('imgPerfilModal').src = fotoSalva ? fotoSalva : fotoPadrao;
    document.getElementById('inputFotoPerfil').value = '';
});

function recuperarSenha() {
    let email = document.getElementById('emailRecuperacao').value
    
    if(email === '') {
        let modal = new Modal(
            "Campo vazio",
            "danger",
            "Por favor, informe um e-mail.",
            "Voltar",
            "d-none"
        );
        modal.mostrarModal();
        return;
    }

    let usuarioEncontrado = null
    let id = localStorage.getItem('id')

    for (let i = 1; i <= id; i++) {
        let usuario = JSON.parse(localStorage.getItem(i))
        if (usuario && usuario.cadastroEmail === email) {
            usuarioEncontrado = usuario
            break
        }
    }

    if (usuarioEncontrado) {
        // Parâmetros que serão enviados para o template do EmailJS
        const templateParams = {
            to_name: usuarioEncontrado.cadastroNome,
            to_email: email,
            // Como é um projeto local, estamos enviando a senha recuperada. 
            // Em um sistema real, enviaríamos um link com token único.
            message: "Sua senha recuperada é: " + usuarioEncontrado.cadastroSenha 
        };

        // Substitua 'SERVICE_ID' e 'TEMPLATE_ID' pelos IDs criados no painel do EmailJS
        emailjs.send('SERVICE_ID', 'TEMPLATE_ID', templateParams)
            .then(function(response) {
                let modal = new Modal(
                    "Sucesso",
                    "success",
                    "E-mail enviado com sucesso para " + email,
                    "Voltar ao Login",
                    "d-none",
                    null,
                    'cadastrarTrue'
                );
                modal.mostrarModal();
            }, function(error) {
                console.log('ERRO AO ENVIAR:', error);
                let modal = new Modal(
                    "Erro",
                    "danger",
                    "Falha ao enviar o e-mail. Verifique as configurações do EmailJS.",
                    "Tentar novamente",
                    "d-none"
                );
                modal.mostrarModal();
            });
    } else {
        let modal = new Modal(
            "Erro",
            "danger",
            "E-mail não encontrado em nossa base de dados.",
            "Tentar novamente",
            "d-none"
        );
        modal.mostrarModal();
    }
}
