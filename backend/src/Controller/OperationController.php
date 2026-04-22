<?php

namespace App\Controller;

use App\Dto\OperationRequestDto;
use App\Entity\Operation;
use App\Entity\User;
use App\Repository\CategoryRepository;
use App\Repository\OperationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/operations')]
class OperationController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(OperationRepository $operationRepository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $operations = $operationRepository->findBy(['user' => $user]);

        return $this->json($operations, context: ['groups' => 'operation:read']);
    }

    #[Route('', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] OperationRequestDto $dto,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $category = $categoryRepository->find($dto->categoryId);
        if (!$category) {
            return $this->json(['error' => 'Category not found'], Response::HTTP_NOT_FOUND);
        }

        /** @var User $user */
        $user = $this->getUser();

        $operation = new Operation();
        $operation->setWording($dto->wording);
        $operation->setAmount((string) $dto->amount);
        $operation->setDate($dto->date ?? new \DateTimeImmutable());
        $operation->setCategory($category);
        $operation->setUser($user);

        $entityManager->persist($operation);
        $entityManager->flush();

        return $this->json($operation, Response::HTTP_CREATED, context: ['groups' => 'operation:read']);
    }

    #[Route('/{id}', methods: ['GET'])]
    #[IsGranted('VIEW', subject: 'operation')]
    public function show(Operation $operation): JsonResponse
    {
        return $this->json($operation, context: ['groups' => 'operation:read']);
    }

    #[Route('/{id}', methods: ['PUT'])]
    #[IsGranted('EDIT', subject: 'operation')]
    public function update(
        Operation $operation,
        #[MapRequestPayload] OperationRequestDto $dto,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $category = $categoryRepository->find($dto->categoryId);
        if (!$category) {
            return $this->json(['error' => 'Category not found'], Response::HTTP_NOT_FOUND);
        }

        $operation->setWording($dto->wording);
        $operation->setAmount((string) $dto->amount);
        $operation->setDate($dto->date ?? new \DateTimeImmutable());
        $operation->setCategory($category);

        $entityManager->flush();

        return $this->json($operation, context: ['groups' => 'operation:read']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    #[IsGranted('DELETE', subject: 'operation')]
    public function delete(Operation $operation, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($operation);
        $entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
