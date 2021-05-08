const { request, response } = require('express');
const express = require('express'); //importar a biblioteca express
const cors = require('cors');
const { v4: uuidv4} = require('uuid'); // importar o uuid (Universal Unique Id)
const app = express(); //Isso cria a aplicação


/**
 * Permite que qualquer front end tenha acesso ao backend(API).
 * pode ser usado assim no desenvolvimento pelo enquanto. Mas depois usar aquele
 * de baixo para definir qual url vai ser permitido para ler os dados do API.
 * 
 */
//app.use(cors());

/* Aqui especificar a origen do front*/
app.use(cors({
    origin: 'http://localhost:8080'
}));



//Usa o express
app.use(express.json()); //o "use" serve para adicionar alguns tipo de funções





const projects = []; //para simular pelo enquanto o banco de dado

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informação no back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 * 
 */


/**
 * Típos de Parâmetros:
 * 
 * Query Params: Filtros e paginação
 * Route Params: Atualizar Recursos na Hora de "Atualizar" e "Deletar"
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 * 
 */


/**
 * Middleware:
 * 
 * Interceptador de requisições que interrompe totalmente a requisição
 * ou alterar dados de requisição.
 * 
 *  o Formato de um middleware é uma função.
 */


//Middleware é escrito neste formato
//Esse é uma 1a forma de aplicar um middleware por causa o logRequest
function logRequests(request, response, next){
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    //console.timeEnd(logLabel); //mede o tempo final da requisição.

    //usar só "next() sem o "return" caso queremos continuar com outro código logo abaixo do next() "
    return next(); //next é importante para continuar terminar o fluxo do middleware

}


//Esse é uma 1a forma de aplicar um middleware por causa o validateProjectId
function validateProjectId(request, response, next){
    const {id} = request.params;

    if(!id.uuidv4){
        //Quando tem o return o middleware é para por aqui e nao executa mais outra linhas seguintes
        return response.status(400).json({ error : 'Invalid Project ID.' });
    }
}


//desse jeito o app.use(express.json())é executado depois o app.use(logRequest)
app.use(logRequests);


//Esse é uma 3a forma de aplicar um middleware escolhendo a rota
//Contain o middleware "validateProjectId"
app.use('/projects/:id', validateProjectId);





//Rota get do aplicativo(Param. Nome rota(denominado recurso) 
//e função de retorno do response)
//Esse é uma 2a forma de aplicar um middleware por causa o logRequest
app.get('/projects', logRequests, (request, response) => {
    //return response.send('Hello World!'); retorna o valor un texto simples
    //return response.json({message: 'Hello GoStack!!!'});
    
    /*const {title, owner} = request.query //inicializando Params Query
    
    console.log(title);
    console.log(owner);
    
    return response.json([
        'Projeto1',
        'Projeto2'
    ]);*/  //vamos deixar comentado pelo enquanto de ter um BD


    //---com uuidv4---//

    //Listar todos os objetos
    /*
        return response.json(projects);
    */


    //Listar com filtro (queremos listar pelo título 'react')
    const {title} = request.query;
    
    //verifica se title não null e que contain o title buscado
    const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

    //retorna o result
    return response.json(results);


});





app.post('/projects', (request, response) => {
    //Para ter dados do corpo da requisição fazer:
    /*const body = request.body;

    console.log(body);
    */


    //Podemos obter os objetos separados fazendo:
    
    /*const {title, owner} = request.body;

    console.log(title);
    console.log(owner);
    
        return response.json([
        'Projeto1',
        'Projeto2',
        'Projeto3'
    ]);
    
    */

    //---com uuidv4---//
    const {title, owner} = request.body;

    const project = {id : uuidv4(), title, owner};

    projects.push(project);

    return response.json(project) //exibir o projeto recém criado.
});




/*não comentar "validateProjectId" para ativar o middleware "validateProjectId" 
quando não 3a forma com use. Ex: app.use('/projects/:id', validateProjectId);
*/

app.put('/projects/:id', /*validateProjectId,*/ (request, response) => {
    /*
    //esse daqui traz todas as informações do objeto
    const params = request.params

    console.log(params);
    */

    //ou para trazer menos informação do objeto fazer

    /*const {id} = request.params
    console.log(id);

    return response.json([
        'Projeto4',
        'Projeto2',
        'Projeto3'
    ]);*/

    //---com uuidv4---//
    const {id} = request.params;
    const {title, owner} = request.body;

    //Retorna o index da posição do projeto dentro do projetos
    const projectIndex = projects.findIndex(project => project.id === id);
    
    //Criar condição caso não encontrou o index do id
    if(projectIndex < 0){
        return response.status(400).json({ error : 'Project not found.' })
    }


    //Criar um novo objeto
    const project = {
        id,
        title,
        owner
    };

    //Colocar no projects na posição "projectIndex", um novo objeto "project"
    projects[projectIndex] = project;

    //retornar o "project" e não a lista completa de projects
    return response.json(project);

});





/*não comentar "validateProjectId" para ativar o middleware "validateProjectId" 
quando não 3a forma com use. Ex: app.use('/projects/:id', validateProjectId);
*/

app.delete('/projects/:id', /*validateProjectId,*/ (request, response) => {
    /*return response.json([
        'Projeto2',
        'Projeto3'
    ]);*/

    //---com uuidv4---//
    const {id} = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error: 'Project not found'});
    }

    //Remover no projects, o project na posição projectIndex
    projects.splice(projectIndex, 1); //remover 1 objeto no posição projectIndex

    //Quando é um conteúdo vazio é melhor mandar o status "204" (no content)
    return response.status(204).send();
});





//Escutar a porta "localhost:3333/""
app.listen(3333, () => {
    console.log('Back-end started 😎');
}); //usar uma porta 3333 para o localhost. Pode outra porta acima de 8080

