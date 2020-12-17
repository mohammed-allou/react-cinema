import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native'
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
    _displayFilm() {
        const film = this.state.film
        if (film != undefined) {
            return (
                <ScrollView style={styles.ScrollView_container}>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(film.backdrop_path) }}
                    />
                    <Text style={styles.title_text}> {film.title}</Text>
                    <Text style={styles.title_text}> Sortie Le : {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.title_text}> Genre : {film.genres[0].name}</Text>
                    <Text style={styles.vote_text}> Vote : {film.vote_average}</Text>
                    <Text style={styles.overview}> {film.overview}</Text>
                    <Text style={styles.title_text}> Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>

                </ScrollView>
            )

        }
    }
    render() {
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
        height: 169,
        margin: 5
    },
    vote_text: {
        fontWeight: 'bold',
        fontSize: 26,
        color: '#666666',
        textAlign: 'right'
    },
    overview: {
        fontStyle: 'italic',
        color: '#666666'
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 5
    },
})
export default FilmDetail