import { ActiveLink } from '../ActiveLink'
import { SingInButton } from './SignInButton'
import styles from './style.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>

          <ActiveLink href="/posts" prefetch activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SingInButton />
      </div>
    </header>
  )
}
