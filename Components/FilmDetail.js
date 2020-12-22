import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'

class FilmDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: true
        }
    }
    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
        if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
            // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
            this.setState({
                film: this.props.favoritesFilm[favoriteFilmIndex]
            })
            return
        }
        // Le film n'est pas dans nos favoris, on n'a pas son détail
        // On appelle l'API pour récupérer son détail
        this.setState({ isLoading: true })
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm)
            .then(data => {
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
    _toggleFavorite() {
        const action = { type: 'TOGGLE_FAVORITE', value: this.state.film }
        this.props.dispatch(action)
    }
    componentDidUpdate() {
        console.log(this.props.favoritesFilm);
    }
    _displayFavoriteImage() {
        let sourceImage = require('../images/_ic_favorite_border.png')
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            sourceImage = require('../images/_ic_favorite.png')
        }
        return (
            <Image
                source={sourceImage}
                style={styles.favorite_image}
            />
        )
    }
    _displayFilm() {
        const film = this.state.film
        if (film != undefined) {
            return (
                <ScrollView style={styles.ScrollView_container}>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(film.backdrop_path) }}
                    />
                    <Text style={styles.title_text1}> {film.title}</Text>
                    <TouchableOpacity
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.title_text}> Sortie Le : {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.title_text}> Genre : {film.genres[0].name}</Text>
                    <Text style={styles.vote_text}> Vote : {film.vote_average}</Text>
                    <Text style={styles.overview}> {film.overview}</Text>
                    <Text style={styles.text_budget}> Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>

                </ScrollView>
            )

        }
    }
    render() {
        console.log(this.props);
        console.log(this.props.navigation)
        const idFilm = this.props.navigation.state.params.idFilm
        return (
            <View style={styles.main_container}>
                {this._displayFilm()}
                {this._displayLoading()}
            </View>
        )

    }
}
const styles = StyleSheet.create({
    main_container: {
        flex: 1,
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
    ScrollView_container: {
        flex: 1
    },
    image: {
        borderRadius: 99,
        height: 169,
        margin: 5
    },
    vote_text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#666666',
        textAlign: 'right'
    },
    overview: {
        fontStyle: 'italic',
        color: '#666666'
    },
    title_text: {
        fontSize: 10,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 5
    },
    title_text1: {
        textAlign: 'center',
        fontFamily: 'ArialArrondiMTBold',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 20
    },
    text_budget: {
        fontSize: 10,
        flex: 3,
        textAlign: 'right'

    },
    favorite_container: {
        alignItems: 'center'
    },
    favorite_image: {
        width: 40,
        height: 40
    }
})
const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}
export default connect(mapStateToProps)(FilmDetail)