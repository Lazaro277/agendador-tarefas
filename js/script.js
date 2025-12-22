const inputSenha = document.getElementById("senha")
inputSenha.addEventListener('keydown', function(event){
    if(event.key === 'Enter') {
        event.preventDefault()
        window.location.href = "inicio.html"
    }
})

function entrar() {
    window.location.href = "inicio.html"
}

function cadastrar() {
    window.location.href = "index.html"
}
