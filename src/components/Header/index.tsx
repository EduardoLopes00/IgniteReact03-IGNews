import Link from 'next/link';
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';

export function Header(){
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="http://localhost:3000/">
                    <a>
                        <img src="/images/logo.svg" 
                            alt="ig.news" />
                    </a>
                </Link> 
                <nav>
                    <Link href="http://localhost:3000/">
                        <a className={styles.active}>Home
                        
                        </a>
                    </Link> 

                    <Link href="http://localhost:3000/posts">
                      <a>Posts</a>
                    </Link> 
                    
                </nav>
                
                <SignInButton />
            </div>

        </header>
    )
}