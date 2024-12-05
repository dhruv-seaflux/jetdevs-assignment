import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, UpdateDateColumn, } from 'typeorm';
import { ArticlesEntity } from './articles.entity';

@Entity('comments')
export class CommentsEntity {
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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt?: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt?: Date;

    @ManyToOne(() => ArticlesEntity, article => article.comments, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'articleId' })
    article: ArticlesEntity;

    @ManyToOne(() => CommentsEntity, comment => comment.childComments, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parentCommentId' })
    parentComment: CommentsEntity;

    @OneToMany(() => CommentsEntity, comment => comment.parentComment)
    childComments: CommentsEntity[];
}
