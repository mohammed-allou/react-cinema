import React from 'react'
import { Animated, Dimensions, Easing} from 'react-native'

class FadeIn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            positionLeft: new Animated.Value(Dimensions.get('window').width)
        }
    }
    componentDidMount() {
        Animated.spring(
            this.state.positionLeft,
            {
                toValue: 5,
                speed:4,
                duration: 5000, // Le temps est en milliseconds ici (3000ms = 3sec)
                easing: Easing.linear
            }
        ).start()
            // Animated.decay(
            //     this.state.topPosition,
            //     {
            //         velocity: 0.8,
            //         deceleration: 0.997,
            //     }
            // ).start();
        // Animated.sequence([ // combiner les animations
        //     // Animated.spring(
        //     //     this.state.topPosition,
        //     //     {
        //     //         toValue: 100,
        //     //         tension: 8,
        //     //         friction: 3
        //     //     }
        //     // ),
        //     Animated.timing(
        //         this.state.topPosition,
        //         {
        //             toValue: 0,
        //             duration: 1000,
        //             easing: Easing.elastic(2)
        //         }
        //     )
        // ]).start()
    }
    render() {
        return (
            <Animated.View style={{ left: this.state.positionLeft }}>
                {this.props.children}
            </Animated.View>
        )
    }
}

export default FadeIn