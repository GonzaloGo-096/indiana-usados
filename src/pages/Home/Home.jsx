/**
 * Home - Página principal
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import styles from './Home.module.css'

const Home = () => {
  return (
    <div className={styles.container}>
      <h1>Hola home</h1>
    </div>
  )
}

export default Home 