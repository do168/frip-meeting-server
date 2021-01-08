-- SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
-- SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
-- SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `frip` DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `frip`.`host` (
  `id` varchar(45) NOT NULL COMMENT '호스트ID',
  `password` varchar(45) NOT NULL COMMENT '호스트 비밀번호',
  `nickname` varchar(45) NOT NULL COMMENT '호스트 닉네임',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'soft delete',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `frip`.`meeting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hostId` varchar(45) NOT NULL,
  `title` varchar(45) NOT NULL,
  `content` varchar(255) NOT NULL,
  `startAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deadline` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `maxParticipant` int(11) DEFAULT NULL,
  `place` varchar(45) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_meeting_host_idx` (`hostId`),
  CONSTRAINT `fk_meeting_host` FOREIGN KEY (`hostId`) REFERENCES `host` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `frip`.`host` (`id`, `password`, `nickname`)
VALUES ('testid', '1111', '테스트계정');


-- INSERT INTO `meeting` (`id`, `name`, `sort`)
-- VALUES (29, '등산', 0),
-- (30, '러닝', 1),
-- (31, '라이딩', 2),
-- (32, '클라이밍', 3),
-- (33, '스키/보드', 4),
-- (34, '사격', 5),
-- (35, '패러글라이딩', 7),
-- (36, '서핑', 6),
-- (37, '스케이트보드', 8),
-- (39, '스쿠버', 9),
-- (40, '무도', 10),
-- (41, '구기스포츠', 11),
-- (42, '라켓스포츠', 12),
-- (43, '수상스포츠', 13),
-- (44, '헬스', 14),
-- (45, '요가', 15),
-- (46, '댄스', 16),
-- (47, '공방', 17),
-- (48, '드로잉', 18),
-- (49, '음악', 19),
-- (50, '사진', 20),
-- (51, '문화체험', 21),
-- (53, '술/음료', 23),
-- (54, '베이킹', 24),
-- (55, '국내여행', 25),
-- (56, '해외여행', 26),
-- (57, '요리', 22);


/*eslint-enable */
