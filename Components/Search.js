import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator } from 'react-native'
import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.searchedText = ""          // Initialisation de notre donnée searchedText en dehors du state

        this.page = 0
        this.totalPages = 0
        this.state = { films: [], isLoading: false }

    }
    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }
    _searchFilms() {
        this.page = 0
        this.totalPages = 0
        this.setState({
            films: []
        }),
            console.log('page: ' + this.page + "/totalPages: " + this.totalPages + "/Nombre de films :" + this.state.films.length)
        this._loadFilms()
    }
    _loadFilms() {
        console.log(this.searchedText);
        if (this.searchedText.length > 0) {  // Seulement si le texte recherché n'est pas vide
            this.setState({ isLoading: true })
            getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1)
                .then(data => {
                    console.log('Hafid' + this.page);
                    console.log('Hafid' + data.page);
                    this.page = data.page
                    this.totalPages = data.total_pages
                    this.setState({
                        films: [...this.state.films, ...data.results],
                        isLoading: false
                    })
                }
                )
        }
    }
    _searchTextInputChanged(text) {
        this.searchedText = text  // Modification du texte recherché à chaque saisie de texte, sans passer par le setState comme avant
        console.log(this.searchedText);
    }
    _displayDetailForFilm=(idFilm)=>{
        this.props.navigation.navigate('FilmDetail',{idFilm : idFilm})
        console.log('Display film with id' + idFilm)
        
    }
    render() {
        console.log('RENDER');
        console.log(this.state.isLoading);
        return (
            <View style={styles.main_container}>
                <TextInput
                    onChangeText={(text) => this._searchTextInputChanged(text)}
                    onSubmitEditing={() => this._searchFilms()}
                    style={styles.textinput}
                    placeholder='Titre du film' />
                <View style={{
                    height: 50, width: 110, justifyContent: 'center'
                }}>
                    <Button title='Rechercher' onPress={() => this._searchFilms()} />

                </View>
                <FlatList
                    data={this.state.films}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <FilmItem film={item} displayDetailForFilm={this._displayDetailForFilm} />}

                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        console.log(this.totalPages +'onEndReached');
                        if (this.page < this.totalPages) {
                            this._loadFilms()
                        }
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        alignItems: 'center',
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 40,
        width: 300,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Search