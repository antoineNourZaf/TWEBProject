import React from "react";
import {Link} from "react-router-dom";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Input
} from "reactstrap";

import axios from 'axios'


import Select from 'react-select';


import dashboardRoutes from "routes/dashboard.jsx";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            languages: [],
            isOpen: false,
            dropdownOpen: false,
            color: "transparent",
            value: '',
            dataLanguages:[]

    };
        this.toggle = this.toggle.bind(this);
        this.dropdownToggle = this.dropdownToggle.bind(this);
    }

    toggle() {
        if (this.state.isOpen) {
            this.setState({
                color: "transparent"
            });
        } else {
            this.setState({
                color: "dark"
            });
        }
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    dropdownToggle(e) {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    getBrand() {
        var name;
        dashboardRoutes.map((prop, key) => {
            if (prop.collapse) {
                prop.views.map((prop, key) => {
                    if (prop.path === this.props.location.pathname) {
                        name = prop.name;
                    }
                    return null;
                });
            } else {
                if (prop.redirect) {
                    if (prop.path === this.props.location.pathname) {
                        name = prop.name;
                    }
                } else {
                    if (prop.path === this.props.location.pathname) {
                        name = prop.name;
                    }
                }
            }
            return null;
        });
        return name;
    }

    openSidebar() {
        document.documentElement.classList.toggle("nav-open");
        this.refs.sidebarToggle.classList.toggle("toggled");
    }

    // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
    updateColor() {
        if (window.innerWidth < 993 && this.state.isOpen) {
            this.setState({
                color: "dark"
            });
        } else {
            this.setState({
                color: "transparent"
            });
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateColor.bind(this));
        let initialLanguages = [];
        fetch('http://localhost:9090/api/languages')
            .then(response => {
                return response.json();
            }).then(data => {

            let optionsLanguages = data[0]["languagesUsedInSwitzerland"].map((option) => option);

            this.setState({
                languages: optionsLanguages,
            });
        });
    }

    componentDidUpdate(e) {
        if (
            window.innerWidth < 993 &&
            e.history.location.pathname !== e.location.pathname &&
            document.documentElement.className.indexOf("nav-open") !== -1
        ) {
            document.documentElement.classList.toggle("nav-open");
            this.refs.sidebarToggle.classList.toggle("toggled");
        }
    }

    onChangeFunc(event) {
        let values = event.value;
        var data=[];
        var temp=[];



        for(var value2 in event)
        {
            data.push({name:event[value2]["label"]});


        }



        fetch('http://localhost:9090/api/repos')
            .then(response => {
                return response.json();
            }).then(dataLanguage => {


             for(var language in data)
             {
                 temp.push({name:data[language]["name"], data:dataLanguage[0]["repos2"][data[language]["name"]]});

             }

        });

        this.setState({dataLanguages:temp});

        console.log(this.state.dataLanguages);

        // TODO regarde comment je peux récupérer cette variable dans la vue et affiche les infos utiles

        this.update.bind(this);





    }


    update = (dataLanguages) => {
        console.log("hello");
        console.log(dataLanguages);
        this.props.onUpdate(dataLanguages);
    };

    render() {

        let languagesOptions = this.state.languages;
        var val = '';

        /*

        let optionsItems = languages.map((language) =>
            <option key={language}> {language}</option>
        );

    */

        return (
            // add or remove classes depending if we are on full-screen-maps page or not
            <Navbar
                color={
                    this.props.location.pathname.indexOf("full-screen-maps") !== -1
                        ? "dark"
                        : this.state.color
                }
                expand="lg"
                className={
                    this.props.location.pathname.indexOf("full-screen-maps") !== -1
                        ? "navbar-absolute fixed-top"
                        : "navbar-absolute fixed-top " +
                        (this.state.color === "transparent" ? "navbar-transparent " : "")
                }
            >
                <Container fluid>
                    <div className="navbar-wrapper">
                        <div className="navbar-toggle">
                            <button
                                type="button"
                                ref="sidebarToggle"
                                className="navbar-toggler"
                                onClick={() => this.openSidebar()}
                            >
                                <span className="navbar-toggler-bar bar1"/>
                                <span className="navbar-toggler-bar bar2"/>
                                <span className="navbar-toggler-bar bar3"/>
                            </button>
                        </div>
                        <NavbarBrand href="/">{this.getBrand()}</NavbarBrand>
                    </div>
                    <NavbarToggler onClick={this.toggle}>
                        <span className="navbar-toggler-bar navbar-kebab"/>
                        <span className="navbar-toggler-bar navbar-kebab"/>
                        <span className="navbar-toggler-bar navbar-kebab"/>
                    </NavbarToggler>
                    <Collapse
                        isOpen={this.state.isOpen}
                        navbar
                        className="justify-content-end"
                    >
                        <form style={{flex: 0.7}}>
                            <Select isMulti
                                    options={languagesOptions}
                                    onChange={this.onChangeFunc.bind(this)}
                            />
                        </form>
                    </Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default Header;
