import main from '../assets/images/main-alternative.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import { Logo } from '../components'

const Landing = () => {
    return (
        <Wrapper>
            <nav>
                <Logo />
            </nav>
            <div className="container page">
                <div className="info">
                    <h1>
                        Job <span>Tracking</span> App
                    </h1>
                    <p>
                        I'm baby blue bottle whatever echo park cred street
                        art meditation plaid you probably haven't
                        heard of them iceland umami.
                        Kogi wayfarers yr tofu banh mi four dollar toast
                        tumeric chia vice air plant.
                    </p>
                    <button className="btn btn-hero">Login/Register</button>
                </div>
                <img src={main} alt="job hunt" className="img main-img" />
            </div>
        </Wrapper>
    )
}


export default Landing
