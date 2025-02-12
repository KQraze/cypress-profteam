const log = (message) => cy.log(message);

const loginForm = {
    username: () => cy.get('input[autocomplete="username"]'),
    password: () => cy.get('input[autocomplete="current-password"]'),
    submit: () => cy.get('button[type="submit"]')
}

const approvedLink = () => cy.get(':nth-child(3) > .navigation-item__title');
const goToWorkspaceButton = (id) => cy.get(`.infinite-loader > :nth-child(${id}) > .button`);

const workspace = {
    textarea: () => cy.get('.form-area'),
    submit: () => cy.get('.comment-textarea__buttons > :nth-child(2)'),
    copy: () => cy.get('.icon-button').contains('Копировать').first(),
    response: () => cy.get('.icon-button').contains('Ответить').first(),
    internshipLink: () => cy.get('.workspace-vacancy__name > .link'),
    file: () => cy.get('#file-uploader'),
    accept: () => cy.get('.status-open__buttons > :nth-child(1)'),
    decline: () => cy.get('.status-open__buttons > :nth-child(2)'),
}

const goToWorkspace = ({ url, routes, employer }, id) => {
    log('Переход на страницу авторизации')
    cy.visit(url + routes.login);

    log('Ввод email')
    loginForm.username().type(employer.login);
    log('Ввод пароля')
    loginForm.password().type(employer.password);
    log('Нажатие на кнопку подтвердить')
    loginForm.submit().contains('Войти').click().wait(3000);

    log('Переход на страницу подтверждения откликов')
    cy.visit(url + routes.responses);

    approvedLink().click({ force: true }).wait(1000)
    goToWorkspaceButton(1).click().wait(3000)
}

const sendMessage = ({ message }) => {
    workspace.textarea().type(message);
    workspace.submit().click()
}

const responseMessage = ({ message }) => {
    workspace.response().click({ force: true })
    workspace.textarea().type(message);
    workspace.submit().click()
}

const copyMessage = () => {
    workspace.copy().click({force: true})
}

const goToInternship = () => workspace.internshipLink().click({ force: true })

const sendFile = (negative) => {
    if (!negative) {
        workspace.file().selectFile('cypress/fixtures/workspace-interaction/logo.png', {force: true}).wait(2000)
        workspace.submit().click()
    } else {
        workspace.file().selectFile('cypress/fixtures/workspace-interaction/torrent.torrent', { force: true }).wait(2000)
        workspace.submit().should('be.disabled');
    }
};

const acceptWorkspace = () => workspace.accept().click()
const declineWorkspace = () => workspace.decline().click()

describe('interaction-in-workspace', () => {
    beforeEach(function () {
        cy.viewport(1920, 1080)
        cy.fixture('config').then((data) => goToWorkspace(data, 1))
    })

    it('Отправка сообщения (позитивный сценарий)', () => cy.fixture('workspace-interaction/data').then(sendMessage));
    it('Отправка сообщения, с ответом на существующее (позитивный сценарий)', () => cy.fixture('workspace-interaction/data').then(responseMessage));
    it('Отправка файла (позитивный сценарий)', () => sendFile());
    it('Копирование сообщения (позитивный сценарий)', copyMessage);
    it('Переход на соответствующую стажировку (позитивный сценарий)', goToInternship);
    it('Отправка сообщения, некорректный тип файла (негативный сценарий)', () => sendFile(true));
})

describe('accept-workspace', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.fixture('config').then((data) => goToWorkspace(data, 2))
    })
    it('Смена статуса рабочего пространства на принято (позитивный сценарий)', acceptWorkspace);
})

describe('accept-workspace', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.fixture('config').then((data) => goToWorkspace(data, 3))
    })
    it('Смена статуса рабочего пространства на отклонено (позитивный сценарий)', declineWorkspace);
})
