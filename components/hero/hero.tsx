import React from 'react'
import Image from 'next/image'
import './hero.css'

const Hero = () => {
  return (
    <div className='hero-wrapper'>
      <div className='hero-content'>
        <h1>Himalayan Honey</h1>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam minima atque eum dicta reiciendis similique rem repellendus repudiandae nulla laudantium hic quo, earum consectetur esse pariatur aut cumque perspiciatis mollitia modi cum officia! Tempore, perferendis delectus minus voluptatem omnis tempora, et a adipisci vitae animi repellat, dignissimos beatae ipsa quas.</p>
        <div className='button-group'>
          <button className='btn-primary'>Shop Now</button>
          <button className='btn-secondary'>Learn More</button>
        </div>
      </div>
      <div className='hero-image'>
        <Image 
          src='/sample-honey.jpg' 
          alt='hero-image' 
          width={500} 
          height={500}
          className='honey-image'
        />
      </div>
    </div>
  )
}

export default Hero