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
        $categories = $categoryRepository->findAll();

        return $this->json($categories, context: ['groups' => 'category:read']);
    }

    #[Route('', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] CategoryRequestDto $dto,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $category = new Category();
        $category->setTitle($dto->title);

        $entityManager->persist($category);
        $entityManager->flush();

        return $this->json($category, Response::HTTP_CREATED, context: ['groups' => 'category:read']);
    }
}
