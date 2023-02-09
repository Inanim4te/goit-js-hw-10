import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// styles
countryList.style.listStyle = 'none';
countryList.style.paddingLeft = '8px';
countryList.style.display = 'flex';
countryList.style.flexDirection = 'column';
countryList.style.gap = '8px';
countryList.style.fontSize = '18px';
// styles

function renderCountryList(countries) {
  if (countries.length === 1) {
    const markup = countries
      .map(country => {
        return `
            <img src=${
              country.flags.svg
            } height="25px" width="37px"> <b class="country-name">${
          country.name.common
        }</b>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages).join(
              ', '
            )}</p>
      `;
      })
      .join('');
    countryInfo.innerHTML = markup;

    // styles
    const countryName = document.querySelector('.country-name');
    countryName.style.fontSize = '35px';
    countryName.style.marginLeft = '7px';
    // styles
  } else if (countries.length > 1 && countries.length < 11) {
    const markup = countries
      .map(country => {
        return `<li class="list-item">
            <img src=${country.flags.svg} height="18px" width="27px"> <b>${country.name.common}</b>
            </li>
      `;
      })
      .join('');
    countryList.innerHTML = markup;

    // styles
    const listItem = document.querySelectorAll('.list-item');
    listItem.forEach(item => {
      item.style.display = 'flex';
      item.style.gap = '7px';
      item.style.alignItems = 'center';
    });
    // styles
  } else if (countries.length > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}

countryInput.addEventListener(
  'input',
  debounce(e => {
    e.target.value = e.target.value.trim();
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    if (e.target.value === '') {
      return;
    }
    fetchCountries(e.target.value)
      .then(countries => {
        if (countries.length === 0) {
          return Notify.failure('Oops, there is no country with that name');
        }
        renderCountryList(countries);
      })
      .catch(error => console.log(error));
  }, DEBOUNCE_DELAY)
);
