import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn, } from 'typeorm';
import { CommentsEntity } from './comments.entity';

@Entity('articles')
export class ArticlesEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    nickname: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    content: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt?: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt?: Date;

    @OneToMany(() => CommentsEntity, comment => comment.article)
    comments: CommentsEntity[];
}
