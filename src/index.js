//Modolos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

//Modolos internos
const fs = require('fs')

operation()

function operation(){
    inquirer.prompt([{
       type: 'list',
       name: 'action',
       message: 'O que você deseja fazer?',
       choices: [
        'Adicionar Lojá',
        'Buscar lojá',
        'Buscar lojás no raio de 100 KM',
        'Lojá Mais procima',
        'Sair',
       ],
    },
    ]).then((resposta)=>{

        const action = resposta['action']
        console.log(action)

        if(action === 'Criar conta'){
            createAccount()
        }else if(action === 'Consultar Saldo'){
            getAccountBalance()
        }else if(action === 'Depositar'){
            deposit()
        }else if(action === 'Sacar'){
            withdraw()
        }else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts'))
            process.exit()
        }

    }).catch((err)=> console.log(err))
}
