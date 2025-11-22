import type { Swiper as SwiperType } from 'swiper'
import { FreeMode, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useState } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

interface AdGalleryProps {
    images: string[]
}
const ThumbSlide = styled(SwiperSlide)(() => ({
    cursor: 'pointer',
    height: '100%',
    '& img': {
        opacity: 0.3,
        transition: 'opacity 0.2s ease, border 0.2s ease',
    },
    '&.swiper-slide-thumb-active img': {
        opacity: 1,
    },
}))

export const AdGallery = ({ images }: AdGalleryProps) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

    if (!images?.length) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: 360,
                    borderRadius: 1,
                    bgcolor: 'grey.300',
                }}
            />
        )
    }

    return (
        <Box>
            <Swiper
                spaceBetween={10}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Thumbs]}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 8,
                    overflow: 'hidden',
                }}
            >
                {images.map((src, idx) => (
                    <SwiperSlide key={idx}>
                        <Box
                            component='img'
                            src={src}
                            alt=''
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 1,
                                display: 'block',
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {images.length > 1 && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={Math.min(6, images.length)}
                    freeMode
                    watchSlidesProgress
                    modules={[FreeMode, Thumbs]}
                    style={{ marginTop: 12, height: 95 }}
                >
                    {images.map((src, idx) => (
                        <ThumbSlide key={idx}>
                            <Box
                                component='img'
                                src={src}
                                alt=''
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        </ThumbSlide>
                    ))}
                </Swiper>
            )}
        </Box>
    )
}
