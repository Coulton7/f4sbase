document.addEventListener("DOMContentLoaded", function() {
    window.dataLayer = window.dataLayer || [];
    const { connectSearchBox } = instantsearch.connectors;
    const searchClient = algoliasearch('ZUQNGEX563', '23e29710cc4469dec35bd50bc2164b3a');

    const renderSearchBox = (renderOptions, isFirstRender) => {
        const { query, refine, clear, isSearchStalled, widgetParams } = renderOptions;

        if (isFirstRender) {
            const input = document.createElement('input');
            input.classList.add('ais-SearchBox-input');
            input.classList.add('form-control');

            const searchButton = document.createElement('button');
            searchButton.classList.add('ais-SearchBox-submit');
            searchButton.classList.add('btn');
            searchButton.classList.add('btn-danger');
            searchButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';

            const loadingIndicator = document.createElement('span');
            loadingIndicator.textContent = 'Loading...';

            searchButton.addEventListener('click', event => {
                refine(input.value);
            });

            input.addEventListener('keydown', function(e){
                if(e.code === "Enter") {
                    refine(input.value);
                }
            });

            widgetParams.container.appendChild(input);
            widgetParams.container.appendChild(searchButton);
            widgetParams.container.appendChild(loadingIndicator);
        }

        widgetParams.container.querySelector('input').value = query;
        widgetParams.container.querySelector('span').hidden = !isSearchStalled;
    };

    const customSearchBox = connectSearchBox (
        renderSearchBox
    );

    const typelistPanel = instantsearch.widgets.panel ({
        templates: {
            header: '<h4>Filter by Content Type</h4>'
        },
        cssClasses: {
            root: 'pt-3'
        }
    })(instantsearch.widgets.refinementList);

    const pagination = instantsearch.widgets.panel ({
        hidden: ({ results }) => results.nbPages === 1,
    })(instantsearch.widgets.pagination)


    window.dataLayer.push({
        algoliaUseroken: 'user-1',
    });

    const search = instantsearch({
        searchClient,
        indexName: 'first4seals',
        typoTolernace: 'strict',
        paginationLimitedTo: 80,
        searchFunction(helper) {
            if(helper.state.query=== '')
            {
                return;
            }
            helper.search();
        },
        insights: {
            onEvent(event) {
                const { widgetType, eventType, payload, hits} = event
                if (widgetType == 'ais.hits' && eventType === 'view') {
                    dataLayer.push({ event: 'Hits Viewed' });
                }
            }
        },
        routing: {
            stateMapping: {
                stateToRoute(uiState){
                    const indexUiState = uiState['first4seals'];
                    return{
                        q: indexUiState.query,
                    }
                },
                routeToState(routeState) {
                    return{
                        ['first4seals']: {
                            query: routeState.q,
                        }
                    }
                }
            }
        }
    });

    search.addWidgets([
        instantsearch.widgets.configure({
            hitsPerPage: 20,
            attributesToSnippet: ['body:80'],
            page:0,
        }),

        instantsearch.widgets.clearRefinements({
            container: '#clear-refinements',
            cssClasses:{
                root: 'pt-5',
                button: [
                    'btn btn-primary text-white'
                ]
            }
        }),

        pagination({
            container: '#pagination',
            totalPages: 3,
            scrollTo:'#searchbox'
        }),

        instantsearch.widgets.stats({
            container:'#stats',
            templates: {
                text(data, { html }) {
                    let count = '';
                    if (data.hasManyResults) {
                        count += `${data.nbHits} results`
                    } else if (data.hasOneResult) {
                        count += `1 result`
                    } else {
                        count += `no result`;
                    }

                    return html`<span class="stat-text">${count} found in ${data.processingTimeMS}ms</span>`;
                }
            }
        }),

        instantsearch.widgets.hits({
            container: '#hits',
            templates:{
                item: data => `
                <div class="serach-result">
                    <small>${data.url}</small>
                    <p class="h3">${data.title}</p>
                    <p id="contentCat" class="lead">${data.type}</p>
                    <p class=${data.body ? '' : 'd-none'}>${instantsearch.snippet({
                            attribute: "body",
                            hit: data
                        })}</p>
                        <a class="btn btn-primary view-details align-self-end" href="${data.url}">Read More</a>
                    </div>`
            }
        }),
    ]);
    search.start();
    document.querySelector('.ais-SearchBox-input').focus();

});