const { Client } = require('pg');
var fs = require('fs');

//Constantes de acesso ao banco de dados
const PORTA = 5432; 
const USUARIO = 'nome_usuario';
const HOST = 'localhost';
const BANCO = 'postgres';
const SENHA = '123';
const NOVO_ENDERECO = 'https://docs.info.ufrn.br/doku.php';

function realizarConsulta(){
    const client = new Client({
        user: USUARIO,
        host: HOST,
        database: BANCO,
        password: SENHA,
        port: PORTA,
    });

    client.connect();
    client.query("SELECT * FROM COMUM.MATERIAL_TREINAMENTO")
        .then(res => {
            let resultado = "";
            let materiais = res.rows;
            materiais.map(material => {
                resultado += gerarUpdate(material); 
            });
            gerarArquivo(resultado);
            client.end();
        })
        .catch(err => { 
            console.error(err);
            client.end();
        })
}

function gerarArquivo(conteudo){
    fs.writeFile('resultado.sql', conteudo, (err) => {
        if(err){
            console.log("Vixe... "+ err.message)
        }                    
        console.log("Arquivo gerado na raiz do projeto");
    });
}

function gerarUpdate(material){    
    let novoEndereco = NOVO_ENDERECO + material.endereco.substr(material.endereco.indexOf("?")); 
    return `
--Material: ${material.nome_material}
--UPDATE UPDATE COMUM.MATERIAL_TREINAMENTO SET ENDERECO = '${material.endereco}' WHERE ID_MATERIAL_TREINAMENTO = ${material.id_material_treinamento};
UPDATE COMUM.MATERIAL_TREINAMENTO SET ENDERECO = '${novoEndereco}' WHERE ID_MATERIAL_TREINAMENTO = ${material.id_material_treinamento};
    `
}
realizarConsulta();