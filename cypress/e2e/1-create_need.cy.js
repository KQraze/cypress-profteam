const log = (message) => cy.log(message);

const loginForm = {
    username: () => cy.get('input[autocomplete="username"]'),
    password: () => cy.get('input[autocomplete="current-password"]'),
    submit: () => cy.get('button[type="submit"]')
}

const createNeedForm = {
    openModalButton: () => cy.get('.needs-block__filters-wrapper > .button'),
    name: () => cy.get('.desktop-modal__content > .vacancy-need-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(1) > .form-control--responsive > .form-input--text'),
    selectPriceType: (id) => cy.get(`.desktop-modal__content > .vacancy-need-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(2) > .salary-field > .salary-field__wrapper--bottom > .radio-list > :nth-child(${id})`),
    minPrice: () => cy.get(':nth-child(1) > .form-control--responsive > .form-input--number'),
    maxPrice: () => cy.get(':nth-child(2) > .form-control--responsive > .form-input--number'),
    fixedPrice: () => cy.get('.form-input--number'),
    responsibilities: () => cy.get('.desktop-modal__content > .vacancy-need-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(3) > .form-control > .form-area'),
    requirements: () => cy.get('.desktop-modal__content > .vacancy-need-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(4) > .form-control > .form-area'),
    selectTypeEmployment: (id) => {
        cy.get('.desktop-modal__content > .vacancy-need-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(5) > .form-select > :nth-child(2) > .form-select__selected').click().wait(1000)
        return cy.get(`.form-select__items > :nth-child(${id})`)
            .click()
    },
    submit: () => cy.get('.desktop-modal__content > .vacancy-need-wrapper > .form > .form__buttons > .button'),
    errors: {
        need_name: () => cy.get(':nth-child(1) > .form-error > span').should('exist'),
        price: () => cy.get('.salary-field > .form-error').should('exist'),
        responsibilities: () => cy.get(':nth-child(3) > .form-error > span').should('exist'),
        requirements: () => cy.get(':nth-child(4) > .form-error > span').should('exist'),
    }
}


const goToNeeds = ({ url, routes, employer }) => {
    log('Переход на страницу авторизации')
    cy.visit(url + routes.login);

    log('Ввод email')
    loginForm.username().type(employer.login);
    log('Ввод пароля')
    loginForm.password().type(employer.password);
    log('Нажатие на кнопку подтвердить')
    loginForm.submit().contains('Войти').click().wait(3000);

    log('Переход на страницу своих потребностей')
    cy.visit(url + routes.needs);
}

const createNeed = (
    {
        need_name,
        price_type,
        responsibilities,
        requirements,
        type_employment,
        min_price,
        max_price,
        fixed_price
    }, negative = false) => {
    log('Открытие модалки создания потребности')
    createNeedForm.openModalButton().click().wait(2000)

    log('Ввод названия потребности')
    need_name && createNeedForm.name().type(need_name);

    log('Выбор типа цены')
    createNeedForm.selectPriceType(price_type).click()

    log('Ввод значений')
    if (price_type === 1 && isFinite(min_price) && isFinite(max_price)) {
        createNeedForm.minPrice().type(min_price);
        createNeedForm.maxPrice().type(max_price);
    }

    if (price_type === 3 && isFinite(fixed_price)) {
        createNeedForm.fixedPrice().type(fixed_price);
    }

    log('Ввод поля "обязанности"')
    responsibilities && createNeedForm.responsibilities().type(responsibilities);
    log('Ввод поля "Требования"')
    requirements && createNeedForm.requirements().type(requirements);

    log('Выбор типа занятости')
    createNeedForm.selectTypeEmployment(type_employment);

    log('Обработка негативного сценария')
    if (negative) {
        log('Отчищаем название')
        createNeedForm.name().clear();
        log('Отчищаем обязанности')
        createNeedForm.requirements().clear();
        log('Отчищаем требования')
        createNeedForm.responsibilities().clear()

        log('Проверяем наличие ошибки на имени')
        createNeedForm.errors.need_name();
        log('Проверяем наличие ошибки на обязанностях')
        createNeedForm.errors.requirements();
        log('Проверяем наличие ошибки на требованиях')
        createNeedForm.errors.responsibilities();

        log('Проверяем наличие ошибки на цене')
        if (price_type === 1) createNeedForm.errors.price();

        log('Проверяем наличие disabled на кнопке')
        createNeedForm.submit().should('be.disabled');
    }

    if (!negative) {
        log('Отправка формы')
        createNeedForm.submit().click()
    }
}

describe('create-need', () => {
    beforeEach(function () {
        cy.viewport(1920, 1080)
        cy.fixture('config').then(goToNeeds)
    })

    it('Позитивный сценарий создания потребности (1)', () => cy.fixture('create-need/positive-1').then(createNeed));
    it('Позитивный сценарий создания потребности (2)', () => cy.fixture('create-need/positive-2').then(createNeed));
    it('Позитивный сценарий создания потребности (3)', () => cy.fixture('create-need/positive-3').then(createNeed));
    it('Негативный сценарий создания потребности (1)', () => cy.fixture('create-need/negative-1').then((data) => createNeed(data, true)));
    it('Негативный сценарий создания потребности (2)', () => cy.fixture('create-need/negative-2').then((data) => createNeed(data, true)));
})