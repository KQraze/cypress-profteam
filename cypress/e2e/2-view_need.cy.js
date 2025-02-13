const log = (message) => cy.log(message);

const needFilters = {
    searchInput: () => cy.get('.form-input--text'),
    searchButton: () => cy.get('div.search-input__field > .button'),
    radio: (id) => cy.get(`.radio-list > :nth-child(${id})`),
    select: () => cy.get('.form-select__selected'),
    option: (id) => cy.get(`.form-select__items > :nth-child(${id})`),
    minPrice: () => cy.get(':nth-child(1) > .form-control--responsive > .form-input--number'),
    maxPrice: () => cy.get(':nth-child(2) > .form-control--responsive > .form-input--number'),
    resetButton: () => cy.get('.custom-modal-mobile__buttons > .button')
}

const goToNeeds = ({ url, routes }) => {
    log('Переход на страницу всех потребностей')
    cy.visit(url + routes.all_needs);
}

const viewNeeds = ({ search, price_type, type_employment, min_price, max_price, refresh }, negative = false) => {
    if (search) {
        needFilters.searchInput().type(search);
        needFilters.searchButton().click().wait(1000);
    }

    price_type && needFilters.radio(price_type).click()

    if (price_type === 1) {
        isFinite(min_price) && needFilters.minPrice().type(min_price)
        isFinite(max_price) && needFilters.maxPrice().type(max_price)

        if (negative && max_price < min_price) {
            needFilters.minPrice().should('have.text', 'Не предусмотренная фронтом ошибка');
        }
    }

    if (type_employment) {
        needFilters.select().click().wait(1000)
        needFilters.option(type_employment).click().wait(3000);
    }

    refresh && needFilters.resetButton().wait(1000).click().wait(2000)
}

describe('view-need', () => {
    beforeEach(function () {
        cy.viewport(1920, 1080)
        cy.fixture('config').then(goToNeeds)
    })

    // it('(позитивный) просмотр потребностей, без заполнения полей (1)', () => cy.fixture('view-need/positive-1').then(viewNeeds));
    // it('(позитивный) просмотр потребностей, с заполнением всех полей (2)', () => cy.fixture('view-need/positive-2').then(viewNeeds));
    it('(позитивный) просмотр потребностей, с заполнением всех полей и сбросом (3)', () => cy.fixture('view-need/positive-3').then(viewNeeds));
    // it('(негативный) просмотр потребностей (1)', () => cy.fixture('view-need/negative-1').then((data) => viewNeeds(data, true)));
})