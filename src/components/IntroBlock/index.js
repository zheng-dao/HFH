import Image from 'next/image'
import HotelsImage from '@public/img/hotelsforheroes.jpeg'

export default function IntroBlock(props) {
    return (
        <div className="intro-block">

            {
                props.withImage && 
                <div className="full-bleed-banner">

                    <Image
                        src={HotelsImage}
                        alt="Suitcase sitting in front of windows."
                    />

                </div>
            }
            
        </div>
    )
}

IntroBlock.defaultProps = {
    withImage: false
}