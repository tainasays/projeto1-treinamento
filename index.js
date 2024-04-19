/*
======== PROJETO 1 - PARTE 1 ===========

1. Criar login
2. Criar cadastro do usuario
3. Criar menu
4. Criar cadastro do pet

*/

// Import do modulo do node para leitura de input
const readline = require('readline');

// Import do modulo para leitura de arquivo
const fs = require('fs');

// Metodo que cria a interface do console que le as entradas e gera as saidas 
// standard input e standard output 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Funcao para receber input assíncrono do teclado
function questionAsync(query) {
    return new Promise((resolve, reject) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

// Especificacao do nome do arquivo
const nomeArquivoDadosUsuario = "dadosUsuarios.json";

// Funcao para exibir o Menu Principal
function exibirMenuPrincipal() {
    console.log();
    console.log("Menu Principal");
    console.log();
    console.log("1 - Acessar Meu Perfil");
    console.log("2 - Cadastrar pet");
    console.log("3 - Buscar");
    console.log();
    return;
}

// Funcao para escolher a opcao do Menu Principal
async function escolherOpcaoMenu() {
    try {
        const opcaoMenuPrincipal = await questionAsync("\nDigite a opção do menu desejada: ");
        switch (opcaoMenuPrincipal){
            case "1":
                acessarMeuPerfil();
                break;
            default:
                console.log("Not implemented.");    
        }
    } catch (err) {
        console.error('Erro ao escolher opção do menu:', err);
    }
    return;
}

// Funcao para editar perfil
function editarPerfil() {
    console.log('Editar perfil');
    console.log('Not implemented');
    rl.close();
    }

// Funcao para acessar o perfil
async function acessarMeuPerfil() {
    console.log("Perfil acessado\n");
    console.log("Deseja editar perfil?");

    const opcaoEditar = await questionAsync("Digite 'S' para sim ou 'N' para não: ");
    if (opcaoEditar.toLowerCase() === 's') {
        editarPerfil();
    } else {
        console.log('Fim do programa');
        rl.close(); // Fechar a interface após receber a entrada do usuário
    }
    
}

// Funcao para encontrar usuario a partir do email do input
function encontrarUsuario(email) {
    try {
        const dados = fs.readFileSync(nomeArquivoDadosUsuario, 'utf8');
        const usuarios = JSON.parse(dados);
        return usuarios.find(user => user.emailCadastro === email);
    } catch (err) {
        console.error('Erro ao ler o arquivo:', err);
        return null;
    }
}

// Funcao para cadastrar usuario
function cadastrarUsuario(nomeCadastro, emailCadastro, senhaCadastro) {
    try {
        const dadosCadastro = fs.readFileSync(nomeArquivoDadosUsuario, 'utf8');
        const usuarios = JSON.parse(dadosCadastro);

        const novoUsuario = { nomeCadastro, emailCadastro, senhaCadastro };
        usuarios.push(novoUsuario);

        // escreve os dados no input no arquivo 
        fs.writeFileSync(nomeArquivoDadosUsuario, JSON.stringify(usuarios, null, 2));

        console.log('Usuário cadastrado com sucesso!');
        rl.close(); // Fecha a interface após o cadastro
    } catch (err) {
        console.error('Erro ao ler ou gravar o arquivo:', err);
    }
}

// Funcao para criar novo cadastro
async function criarConta() {
    console.log('Cadastro em andamento...');

    // Solicitacao dos dados do novo usuario (output e input)
    rl.question('Digite seu nome: ', (nomeCadastro) => {
        rl.question('Digite seu email: ', (emailCadastro) => {
            const usuarioExistente = encontrarUsuario(emailCadastro);
            if (usuarioExistente) {
                console.log('Email já cadastrado. Por favor, escolha outro.');
                criarConta(); // Chama a funcao novamente
                return;
            }

            rl.question('Digite uma senha: ', (senhaCadastro) => {
                cadastrarUsuario(nomeCadastro, emailCadastro, senhaCadastro);
            });
        });
    });
}

// Funcao que autentica o login
async function autenticarLogin(email, senha) {
    try {
        const usuarioEncontrado = encontrarUsuario(email);

        if (!usuarioEncontrado) {
            console.log('Usuário não encontrado.\nDeseja cadastrar-se?');

            const opcao = await questionAsync("Digite 'S' para sim ou 'N' para não: ");
            if (opcao.toLowerCase() === 's') {
                await criarConta();
            } else {
                console.log('Fim do programa');
                rl.close();
            }
        } else {
            if (usuarioEncontrado.senhaCadastro === senha) {
                console.log('Login bem-sucedido!');
                exibirMenuPrincipal();
                await escolherOpcaoMenu();
            } else {
                console.log('Senha incorreta');
            }
            //rl.close();
        }
    } catch (err) {
        console.error('Erro ao autenticar o login:', err);
        rl.close();
    }
}

// Solicitacao dos dados de login do usuario
rl.question('Digite seu email: ', (emailEntrada) => {
    rl.question('Digite sua senha: ', (senhaEntrada) => {
        autenticarLogin(emailEntrada, senhaEntrada);
    });
});