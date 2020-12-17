import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
class FilmItem extends React.Component {
    render() {
        return (
            <View style={styles.main_container} >
                <View>
                    <Text style={styles.Title_text} >Image du film</Text>

                </View>
                <View flexDirection="column">
                    <View flexDirection="row">
                        <Text style={{ flex: 1, backgroundColor: 'blue' }}>Titre du film(text)</Text>
                        <Text style={{ backgroundColor: 'brown' }}>Vote(text)</Text>
                    </View>
                    <View style={{ height: 50, width: 265, backgroundColor: 'green' }}><Text>Description(text) </Text></View>
                    <View style={{ height: 40, width: 265, backgroundColor: 'white' }}>
                        <Text>Sorti le 00/00/0000(text)</Text>
                    </View>


                </View>


            </View>
        )
    }
}
const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        height: 180,
        flexDirection: 'row',
        backgroundColor: 'gray'
    },
    Title_text: { height: 150, width: 90, backgroundColor: 'purple' }
})
export default FilmItem
// Components/FilmItem.js

import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'

class FilmItem extends React.Component {
    render() {
        return (
            <View style={styles.main_container}>
                <Image
                    style={styles.image}
                    source={{ uri: "image" }}
                />
                <View style={styles.content_container}>
                    <View style={styles.header_container}>
                        <Text style={styles.title_text}>Titre du film</Text>
                        <Text style={styles.vote_text}>Vote</Text>
                    </View>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text} numberOfLines={6}>Description</Text>
                        {/* La propriété numberOfLines permet de couper un texte si celui-ci est trop long, il suffit de définir un nombre maximum de ligne */}
                    </View>
                    <View style={styles.date_container}>
                        <Text style={styles.date_text}>Sorti le 00/00/0000</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        height: 190,
        flexDirection: 'row'
    },
    image: {
        width: 120,
        height: 180,
        margin: 5,
        backgroundColor: 'gray'
    },
    content_container: {
        flex: 1,
        margin: 5
    },
    header_container: {
        flex: 3,
        flexDirection: 'row'
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 5
    },
    vote_text: {
        fontWeight: 'bold',
        fontSize: 26,
        color: '#666666'
    },
    description_container: {
        flex: 7
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666'
    },
    date_container: {
        flex: 1
    },
    date_text: {
        textAlign: 'right',
        fontSize: 14
    }
})

export default FilmItem

import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator } from 'react-native'
import films from '../Helpers/filmData'
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
                    renderItem={({ item }) => <FilmItem film={item} />}

                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        console.log('onEndReached');
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
        marginTop: 20,
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

// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'

class FilmDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: true
        }
    }

    componentDidMount() {
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            })
        })
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

    _displayFilm() {
        const { film } = this.state
        if (film != undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(film.backdrop_path) }}
                    />
                    <Text style={styles.title_text}>{film.title}</Text>
                    <Text style={styles.description_text}>{film.overview}</Text>
                    <Text style={styles.default_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.default_text}>Note : {film.vote_average} / 10</Text>
                    <Text style={styles.default_text}>Nombre de votes : {film.vote_count}</Text>
                    <Text style={styles.default_text}>Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                    <Text style={styles.default_text}>Genre(s) : {film.genres.map(function (genre) {
                        return genre.name;
                    }).join(" / ")}
                    </Text>
                    <Text style={styles.default_text}>Companie(s) : {film.production_companies.map(function (company) {
                        return company.name;
                    }).join(" / ")}
                    </Text>
                </ScrollView>
            )
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                {this._displayLoading()}
                {this._displayFilm()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollview_container: {
        flex: 1
    },
    image: {
        height: 169,
        margin: 5
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    }
})

export default FilmDetail
