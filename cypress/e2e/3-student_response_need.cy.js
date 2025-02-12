const log = (message) => cy.log(message);

const loginForm = {
    username: () => cy.get('input[autocomplete="username"]'),
    password: () => cy.get('input[autocomplete="current-password"]'),
    submit: () => cy.get('button[type="submit"]')
}

const responseButton = () => cy.get('#app > div.page > div > section > div > div.needs-block__needs-filters-wrapper > div.infinite-loader.need-list > div:nth-child(1) > div.need-item__info-wrapper > div.need-item__footer-wrapper > div > div.need-footer__button-wrapper > button.button.button__background-color-light-blue.button__size-small.button__color-white.vacancy-page-card__button')

const goToResponses = ({ url, routes, student }) => {
    log('Переход на страницу авторизации')
    cy.visit(url + routes.login);

    log('Ввод email')
    loginForm.username().type(student.login);
    log('Ввод пароля')
    loginForm.password().type(student.password);
    log('Нажатие на кнопку подтвердить')
    loginForm.submit().contains('Войти').click().wait(3000);

    log('Переход на страницу своих потребностей')
    cy.visit(url + routes.all_needs);
}

const studentResponse = (negative = false) => {
    if (negative) {
        responseButton().should('be.disabled');
    } else {
        responseButton().click({ force: true });

        responseButton().should('be.disabled');
    }
}


describe('student-response', () => {
    beforeEach(function () {
        cy.viewport(1920, 1080)
        cy.fixture('config').then(goToResponses)
    })

    it('Оставление отклика студентом (позитивный сценарий)', () => studentResponse());
    it('Оставление отклика студентом (негативный сценарий)', () => studentResponse(true));
})