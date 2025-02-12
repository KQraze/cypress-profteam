const log = (message) => cy.log(message);

const loginForm = {
    username: () => cy.get('input[autocomplete="username"]'),
    password: () => cy.get('input[autocomplete="current-password"]'),
    submit: () => cy.get('button[type="submit"]')
}

const acceptButton = () => cy.get(':nth-child(1) > .responses-list-item__actions > :nth-child(1)')
const goToWorkspaceButton = () => cy.get('.infinite-loader > :nth-child(1) > .button')

const goToResponses = ({ url, routes, employer }) => {
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
}

const employerConfirmResponse = (negative = false) => {

    if (!negative) {
        acceptButton().click({ force: true });
        goToWorkspaceButton().should('exist');
    } else {
        goToWorkspaceButton().should('exist');
    }
}

describe('employer-confirm-response-need', () => {
    beforeEach(function () {
        cy.viewport(1920, 1080)
        cy.fixture('config').then(goToResponses)
    })

    it('Подтверждение отклика работодателем (позитивный сценарий)', employerConfirmResponse);
    it('Подтверждение отклика работодателем (негативный сценарий)', () => employerConfirmResponse(true));
})