import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, } from 'typeorm';
import { ArticleEntity } from './articles.entity';

@Entity('comments')
export class CommentEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'bigint', nullable: true })
    articleId: number | null;

    @Column({ type: 'bigint', nullable: true })
    parentCommentId: number | null;

    @Column({ type: 'varchar', length: 255, nullable: false })
    nickname: string;

    @Column({ type: 'text', nullable: false })
    content: string;

    @CreateDateColumn({ type: 'timestamp' })
    creationDate: Date;

    @ManyToOne(() => ArticleEntity, article => article.comments, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'article_id' })
    article: ArticleEntity;

    @ManyToOne(() => CommentEntity, comment => comment.childComments, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_comment_id' })
    parentComment: CommentEntity;

    @OneToMany(() => CommentEntity, comment => comment.parentComment)
    childComments: CommentEntity[];
}
