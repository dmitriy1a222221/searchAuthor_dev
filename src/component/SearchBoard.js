import React, { Component } from 'react';
import axios from 'axios';
import orderBy from 'lodash.orderby';


import SearchField from './SearchField';
import AuthorInfo from './AuthorInfo';


class SearchBoard extends Component {
    constructor() {
        super();
        this.state = {
            serverData: null,
            dataIsReady: false,
            searchQuery: '',
            filterAuthor: null,

            currentPage: 1,
            itemsPerPage: 10,

            renderItems: null,
            pageNumbers: [],

            paginationActiveNum: null,
            prev: null,
            next: null,
        }

        this.counter = 0;

        this.searchQuery = this.searchQuery.bind(this);
        this.filtrationData = this.filtrationData.bind(this);
        this.filterLogic = this.filterLogic.bind(this);
        this.changePage = this.changePage.bind(this);
        this.paginationLogic = this.paginationLogic.bind(this);
        this.clickArrow = this.clickArrow.bind(this);
    }

    componentDidMount() {
        axios.get('data.json')
            .then(res => {
                this.setState({
                    serverData: res.data,
                    dataIsReady: true,
                    //pre-sorted data
                    filterAuthor: orderBy(orderBy(res.data, 'name', 'desc'), 'pageviews', 'desc'),
                }, this.paginationLogic)
            })
    }

    //next three methods for filtration data
    filterLogic (authors, searchQuery) {
        return (
            authors.filter(
                item => item.name.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0
            )
        )
    };
    filtrationData() {
        this.changePage();
        this.counter = 0;
        let filterData = this.filterLogic(this.state.serverData, this.state.searchQuery);

        this.setState((prevState) => {
            return {
                filterAuthor: filterData
            }
        }, this.paginationLogic)
    };
    searchQuery(query) {
        this.setState((prevState) => {
                return {
                    searchQuery: query,
                    paginationActiveNum: 1
                }
            },
            this.filtrationData
        );
    };

    changePage() {
        this.setState((prevState) => {
            return {
                currentPage: prevState.paginationActiveNum
            }
        }, this.paginationLogic);
    }

    paginationLogic() {
        const { filterAuthor, currentPage, itemsPerPage } = this.state;

        let Colors = {};
        Colors.names = {
            blue: "#67c9de",
            cyan: "#ba6fcb",
            darkblue: "#e39473",
            darkcyan: "#5aa9e6",
            darkkhaki: "#ac5061",
            darkmagenta: "#9ec07f",
            darkolivegreen: "#b4507b",
            darkorange: "#345feb",
            darkorchid: "#6bd3dd",
            darkorchid1: "#c1da90",
        };
        Colors.random = function() {
            var result;
            var count = 0;
            for (var prop in this.names)
                if (Math.random() < 1/++count)
                    result = prop;
            return result;
        };

        // Logic for displaying items
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filterAuthor.slice(indexOfFirstItem, indexOfLastItem);


         const renderItems = currentItems.map((item, index) => {
            let togglers = {
                bgItem: '',
                medalToggle: ''
            };

            //coloring items
            if (index % 2 === 0) {
                togglers.bgItem = 'odd'
            } else {
                togglers.bgItem = 'pair'
            }

            //add medal for top author
            switch (indexOfFirstItem + (index + 1)) {
                case 1:
                    togglers.medalToggle = "medal-on";
                    break;
                case 2:
                    togglers.medalToggle = "medal-on";
                    break;
                case 3:
                    togglers.medalToggle = "medal-on";
                    break;
                default:
                    togglers.medalToggle = ""
            }
            return (
                !this.state.dataIsReady
                    ? "Загрузка..."
                    :
                    <AuthorInfo
                        key={index}
                        colorRandom={Colors.random()}
                        classNameNew={togglers}
                        orderNum={indexOfFirstItem + (index + 1)}
                        name={item.name}
                        countPub={item.count_pub}
                        pageviews={item.pageviews}
                    />
            )
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filterAuthor.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }

        //arrow
        let arrPage = pageNumbers;
        let arrowPrev = document.querySelector('.arrPrev-wrap')
        let arrowNext = document.querySelector('.arrNext-wrap')

        const set = () => {
            this.setState({
                paginationActiveNum: arrPage[this.counter]
            })
        };
        const init = () => {
            set(arrPage[this.counter]);

            if(this.counter === 0) {
                arrowPrev.style.cssText = "visibility: hidden"
            }else {
                arrowPrev.style.cssText = "visibility: visible"
            }
            if (this.counter === arrPage.length -1) {
                arrowNext.style.cssText = "visibility: hidden"
            }else {
                arrowNext.style.cssText = "visibility: visible"
            }
        };
        const prev = () => {
            this.counter--;
            if(this.counter < 0) {
                this.counter = 0;
                arrowPrev.style.cssText = "visibility: hidden"
            } else {
                arrowPrev.style.cssText = "visibility: visible"
            }
            set(arrPage[this.counter]);
            this.changePage()

        };
        const next = () => {
            this.counter++;
            if(this.counter === arrPage.length) {
                this.counter = arrPage.length ;
                arrowNext.style.cssText = "visibility: hidden"
            } else {
                arrowNext.style.cssText = "visibility: visible"
            }
            set(arrPage[this.counter]);
            this.changePage()
        };
        //init first number page
        init();

        this.setState({
            renderItems: renderItems,
            pageNumbers: pageNumbers,
            prev: prev,
            next: next
        })
    }

    //call func for change page
    clickArrow(e) {
        switch (e.target.id) {
            case "arrPrev":
                this.state.prev();
                break;

            case "arrNext" :
                this.state.next();
                break;

            default:
                return
        }
    }

    render() {

        return (
            <div className="SearchBoard-wrap">
                <div className="SearchBoard">
                    <SearchField
                        searchQuery={this.searchQuery}
                    />
                    <div>
                        {this.state.renderItems}
                    </div>
                </div>
                <div className="pagination-block">
                    <div id="arrPrev" className="arrPrev-wrap" onClick={this.clickArrow}>
                        <div  id="arrPrevChild" className="arrPrev"></div>
                    </div>
                    <span>
                        {this.state.paginationActiveNum ? this.state.paginationActiveNum : 0} - {this.state.pageNumbers.length}
                    </span>
                    <div id="arrNext" className="arrNext-wrap" onClick={this.clickArrow}>
                        <div id="arrNextChild" className="arrNext"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchBoard;
