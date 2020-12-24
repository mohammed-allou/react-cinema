import React from 'react'
import { View, Share, Text, StyleSheet, ActivityIndicator, ScrollView, Image, TouchableOpacity, Platform } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'

class FilmDetail extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
        if (params.film != undefined && Platform.OS === "ios") {
            return {
                // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
                headerRight: <TouchableOpacity
                    style={styles.share_touchable_headerrightbutton}
                    onPress={() => params.shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../images/ic_share.ios.png')} />
                </TouchableOpacity>
            }
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: false
        }
        // Ne pas oublier de binder la fonction _shareFilm sinon, lorsqu'on va l'appeler depuis le headerRight de la navigation, this.state.film sera undefined et fera planter l'application
        this._toggleFavorite = this._toggleFavorite.bind(this)
        this._shareFilm = this._shareFilm.bind(this)
    }
    // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation. Ainsi on aura accès à ces données au moment de définir le headerRight
    _updateNavigationParams() {
        this.props.navigation.setParams({
            shareFilm: this._shareFilm,
            film: this.state.film
        })
    }
    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
        if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
            // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
            this.setState({
                film: this.props.favoritesFilm[favoriteFilmIndex]
            }, () => { this._updateNavigationParams() })
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
                }, () => { this._updateNavigationParams() })
            })
    }
    _shareFilm() {
        const { film } = this.state
        Share.share({ title: film.title, message: film.overview })
    }
    _displyFloatingActionButton() {
        const { film } = this.state
        if (film != undefined && Platform.OS === "android") { // Uniquement sur Android et lorsque le film est chargé
            return (
                <TouchableOpacity
                    style={styles.share_touchable_floatingactionbutton}
                    onPress={() => this._shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../images/ic_share.android.png')} />
                </TouchableOpacity>
            )
        }
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
        let shouldEnlarge = false
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            sourceImage = require('../images/_ic_favorite.png')
            shouldEnlarge=true
        }
        return (
            <EnlargeShrink shouldEnlarge={shouldEnlarge}>
                
                <Image
                    source={sourceImage}
                    style={styles.favorite_image}
                />
            </EnlargeShrink>
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
        return (
            <View style={styles.main_container}>
                {this._displayFilm()}
                {this._displayLoading()}
                {this._displyFloatingActionButton()}
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
        flex:1,
        width: null,
        height: null
    },
    share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
    },
    share_image: {
        width: 30,
        height: 30
    },
    share_touchable_headerrightbutton: {
        marginRight: 8
    }
})
const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}
export default connect(mapStateToProps)(FilmDetail)