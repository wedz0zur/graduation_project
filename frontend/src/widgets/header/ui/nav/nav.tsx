import Link from 'next/link'

export default function Nav(){
    return(
        <nav className='hidden lg:flex gap-[30px] text-sm text-[#666666]' >
            <Link href='/catalog' className='hover:text-[#E30613] transition-colors'>Каталог</Link>
            <Link href='/projects' className='hover:text-[#E30613] transition-colors'>Проекты</Link>
            <Link href='/reviews' className='hover:text-[#E30613] transition-colors'>Отзывы</Link>
            <Link href='/contacts' className='hover:text-[#E30613] transition-colors'>Контакты</Link>
        </nav>
    )
}
