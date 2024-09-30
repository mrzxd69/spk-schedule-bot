/*
  Warnings:

  - A unique constraint covering the columns `[route]` on the table `groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[course]` on the table `groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "groups_route_key" ON "groups"("route");

-- CreateIndex
CREATE UNIQUE INDEX "groups_course_key" ON "groups"("course");
