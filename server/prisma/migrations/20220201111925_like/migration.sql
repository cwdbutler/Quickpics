-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
