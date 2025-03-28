ALTER TABLE `automationStatus` ADD `projectId` int;--> statement-breakpoint
ALTER TABLE `platform` ADD `projectId` int;--> statement-breakpoint
ALTER TABLE `testCoveredBy` ADD `projectId` int;--> statement-breakpoint
ALTER TABLE `type` ADD `projectId` int;--> statement-breakpoint
ALTER TABLE `automationStatus` ADD CONSTRAINT `automationStatus_projectId_projects_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`projectId`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `platform` ADD CONSTRAINT `platform_projectId_projects_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`projectId`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `testCoveredBy` ADD CONSTRAINT `testCoveredBy_projectId_projects_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`projectId`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `type` ADD CONSTRAINT `type_projectId_projects_projectId_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`projectId`) ON DELETE set null ON UPDATE no action;