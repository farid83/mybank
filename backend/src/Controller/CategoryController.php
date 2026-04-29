<?php

namespace App\Controller;

use App\Dto\CategoryRequestDto;
use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/categories')]
class CategoryController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(CategoryRepository $categoryRepository): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $categories = $categoryRepository->findByGlobalOrUser($user);

        return $this->json($categories, context: ['groups' => 'category:read']);
    }

    #[Route('', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] CategoryRequestDto $dto,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $category = new Category();
        $category->setTitle($dto->title);

        // Si l'utilisateur n'est pas admin, on lie la catégorie à son compte (privée)
        // Si c'est un admin, l'user reste null (catégorie globale)
        if (!$this->isGranted('ROLE_ADMIN')) {
            $category->setUser($this->getUser());
        }

        $entityManager->persist($category);
        $entityManager->flush();

        return $this->json($category, Response::HTTP_CREATED, context: ['groups' => 'category:read']);
    }
}
