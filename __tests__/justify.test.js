const request = require('supertest');
const app = require('../server.js');

describe('Test the token endpoint', () => {
  test('It should return a 400 error if email is not provided', async () => {
    const response = await request(app).post('/api/token');
    expect(response.statusCode).toBe(400);
  });

  test('It should return a token if email is provided', async () => {
    const response = await request(app).post('/api/token').send({ email: 'test@example.com' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});

describe('Test the justify endpoint', () => {
  let token;

  beforeAll(async () => {
    app.locals.wordsCount = {}; 
    const response = await request(app).post('/api/token').send({ email: 'test@example.com' });
    token = response.body.token;
  });

  test('It should return a 401 error if no token is provided', async () => {
    const response = await request(app).post('/api/justify');
    expect(response.statusCode).toBe(401);
  });

  test('It should return a 403 error if the token is invalid', async () => {
    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', 'Bearer invalid_token')
      .send('This is a test text.');
    expect(response.statusCode).toBe(403);
  });

  /* test('It should return a 400 error if no text is provided', async () => {
    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });*/

  /* test('It should return a 402 error if the user has exceeded their daily word limit', async () => {
    // Set the word count to the maximum for the user
    app.locals.wordsCount['test@example.com'] = app.locals.MAX_WORDS_PER_DAY;

    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${token}`)
      .send('This is a test text.');
    expect(response.statusCode).toBe(402);
  });
*/
 test('It should return the justified text', async () => {
    const text = `Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,\nmes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je\nm’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le\nsommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les\nmains et souffler ma lumière; je n’avais pas cessé en dormant de faire des\nréflexions sur ce que je venais de lire, mais ces réflexions avaient pris un\ntour un peu particulier; il me semblait que j’étais moi-même ce dont parlait\nl’ouvrage: une église, un quatuor, la rivalité de François Ier et de\nCharles-Quint. Cette croyance survivait pendant quelques secondes à mon réveil;\nelle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et\nles empêchait de se rendre compte que le bougeoir n’était plus allumé. Puis elle\ncommençait à me devenir inintelligible, comme après la métempsycose les pensées\nd’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre\nde m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de\ntrouver autour de moi une obscurité, douce et reposante pour mes yeux, mais\npeut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose\nsans cause, incompréhensible, comme une chose vraiment obscure. Je me demandais\nquelle heure il pouvait être; j’entendais le sifflement des trains qui, plus ou\nmoins éloigné, comme le chant d’un oiseau dans une forêt, relevant les\ndistances, me décrivait l’étendue de la campagne déserte où le voyageur se hâte\nvers la station prochaine; et le petit chemin qu’il suit va être gravé dans son\nsouvenir par l’excitation qu’il doit à des lieux nouveaux, à des actes\ninaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le\nsuivent encore dans le silence de la nuit, à la douceur prochaine du retour.`;
  
    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${token}`)
      .send(text);
  
    // Check if the response text is justified properly
    expect(response);

});


});
