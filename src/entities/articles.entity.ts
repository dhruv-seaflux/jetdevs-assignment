import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, } from 'typeorm';
import { CommentEntity } from './comments.entity';

@Entity('articles')
export class ArticleEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    nickname: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    content: string;

    @CreateDateColumn({ type: 'timestamp' })
    creationDate: Date;

    @OneToMany(() => CommentEntity, comment => comment.article)
    comments: CommentEntity[];
}
