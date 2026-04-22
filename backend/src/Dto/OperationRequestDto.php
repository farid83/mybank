<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class OperationRequestDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(max: 255)]
        public readonly string $wording,

        #[Assert\NotBlank]
        #[Assert\Positive]
        public readonly float $amount,

        #[Assert\Type("\DateTimeInterface")]
        public readonly ?\DateTimeInterface $date = null,

        #[Assert\NotBlank]
        #[Assert\Positive]
        public readonly int $categoryId,
    ) {
    }
}
